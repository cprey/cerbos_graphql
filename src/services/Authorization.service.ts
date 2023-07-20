import { ApolloError } from "apollo-server-errors";
import { config } from "node-config-ts";
import { Service } from "typedi";

import { GRPC as Cerbos } from "@cerbos/grpc";
import logger from "../utils/logger";
import { AuthChecker } from "type-graphql";
import { IContext } from "../server/context.interface";

const log = logger("CerbosService");

export class AuthorizationError extends ApolloError {
  constructor(message: string) {
    super(message, "AUTHORIZATION_ERROR");
    Object.defineProperty(this, "name", { value: "AuthorizationError" });
  }
}

@Service({ global: true })
export class AuthorizationService {
  public cerbos: Cerbos;

  constructor() {
    this.cerbos = new Cerbos(config.cerbos.host, { tls: config.cerbos.tls });
  }
}

// as a class https://typegraphql.com/docs/authorization.html#how-to-use
export const customAuthChecker: AuthChecker<IContext> = (
  { root, args, context, info },
  roles,
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  return true; // or false if access is denied
};
