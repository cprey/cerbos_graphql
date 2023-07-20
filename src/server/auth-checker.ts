import { AuthChecker } from "type-graphql";
import logger from "../utils/logger";
import { IContext } from "./context.interface";
const log = logger("authChecker");

// as a class https://typegraphql.com/docs/authorization.html#how-to-use
export const authChecker: AuthChecker<IContext> = (
  { root, args, context, info },
  roles,
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  return true; // or false if access is denied
};

// @todo upgrade packages 
  // convert this to class
  // Inject correct services to resolve AuthN/Z & Identity
