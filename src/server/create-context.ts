// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { AuthenticationError } from "apollo-server-errors";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import DataLoader from "dataloader";
import Container from "typedi";
import { Persons } from "../data/persons.data";
import { CerbosService } from "../services/Cerbos.service";
import { ResourceCheck } from "@cerbos/core";
import logger from "../utils/logger";
import { IContext } from "./context.interface";

import * as jose from "jose";

const log = logger("createContext");

export default async (request: ExpressContext): Promise<IContext> => {
  // Create a new request container
  const requestId = Math.floor(
    Math.random() * Number.MAX_SAFE_INTEGER,
  ).toString();
  const container = Container.of(requestId);
  const cerbosService = Container.get(CerbosService);

  if (!request.req.headers["x-auth-token"]) {
    throw new AuthenticationError("Access denied: No token provided");
  }

  if (Array.isArray(request.req.headers["x-auth-token"])) {
    throw new AuthenticationError("Access denied: Token not valid");
  }
  const claims = jose.decodeJwt(request.req.headers["x-auth-token"]);
  const person = Persons.find((p) => p.id === parseInt(claims.sub));

  // User not found so denied
  if (!person) {
    throw new AuthenticationError("Access denied: Token not valid");
  }

  // Set the context in the container
  const context: IContext = {
    req: request.req,
    requestId,
    person,
    loaders: {
      authorize: new DataLoader(async (resources: ResourceCheck[]) => {
        const results = await cerbosService.cerbos.checkResources({
          principal: {
            id: person.id.toString(),
            roles: [person.role.toString()],
            attributes: JSON.parse(JSON.stringify(person)),
          },
          resources,
        });
        return resources.map((key) => {
          return results.findResult({
            kind: key.resource.kind,
            id: key.resource.id,
          });
        });
      }),
    },
  };
  container.set("context", context);

  return context;
};
