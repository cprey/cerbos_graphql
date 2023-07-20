import { Service } from "typedi";
import logger from "../utils/logger";
import * as jose from "jose";
import { AuthenticationError } from "apollo-server-errors";
import { ExpressContext } from "apollo-server-express";

const log = logger("IdentityService");

@Service({ global: true })
export class AuthenticationService {
  constructor() {
    log.info("created");
  }

  async resolve(context: ExpressContext): Promise<jose.JWTPayload> {
    if (!context.req.headers["x-auth-token"]) {
      throw new AuthenticationError("Access denied: No token provided");
    }
    if (Array.isArray(context.req.headers["x-auth-token"])) {
      throw new AuthenticationError("Access denied: Token not valid");
    }
    return jose.decodeJwt(context.req.headers["x-auth-token"]);
  }
}
