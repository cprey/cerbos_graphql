// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { AuthenticationError } from "apollo-server-errors";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import DataLoader from "dataloader";
import Container from "typedi";
import { AuthorizationService } from "../services/Authorization.service";
import { ResourceCheck } from "@cerbos/core";
import logger from "../utils/logger";
import { IContext } from "./context.interface";
import { IdentityService } from "../services/Identity.service";
import { AuthenticationService } from "../services/Authentication.service";

const log = logger("createContext");

export default async (expressContext: ExpressContext): Promise<IContext> => {
  // Create a new request container
  const requestId = Math.floor(
    Math.random() * Number.MAX_SAFE_INTEGER,
  ).toString();
  const container = Container.of(requestId);
  const authenticationService = Container.get(AuthenticationService);
  const authorizationService = Container.get(AuthorizationService);
  const identityService = Container.get(IdentityService);

  const claims = await authenticationService.resolve(expressContext);
  const person = await identityService.get(parseInt(claims.sub));

  // User not found so denied - what about anonymous users
  if (!person) {
    throw new AuthenticationError("Access denied: Token not valid");
  }

  // Set the context in the container
  const context: IContext = {
    req: expressContext.req,
    requestId,
    person,
    loaders: {
      authorize: new DataLoader(async (resources: ResourceCheck[]) => {
        const results = await authorizationService.cerbos.checkResources({
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
