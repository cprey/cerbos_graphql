import { ApolloError } from "apollo-server-errors";
import { Arg, Ctx, Query } from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import {
  AuthorizationError,
  CerbosService,
} from "../services/Cerbos.service";
import { Effect, CheckResourcesResult } from "@cerbos/core";
import { UsersService } from "../services/Users.service";
import User from "../types/User.type";

import logger from "../utils/logger";

const log = logger("UsersQueries");

@Service()
class UsersQueries {
  @Inject(() => CerbosService)
  private cerbos: CerbosService;

  @Inject(() => UsersService)
  private usersService: UsersService;

  constructor() {
    log.info("created");
  }

  @Query((returns) => [User])
  async users(@Ctx() context: IContext): Promise<User[]> {
    const users = await this.usersService.list();
    const action = "view";

    const authorized = await context.loaders.authorize.loadMany(
      users.map((user) => {
        return {
          actions: [action],
          resource: {
            id: user.id.toString(),
            kind: "user:object",
            attributes: {
                id: user.id,
                status: user.status.toString(),
                ownerId: user.personId,
            },
          },
        };
      })
    );
    return users.filter(
      (_, i) => (authorized[i] as CheckResourcesResult).actions[action] === Effect.ALLOW
    );
  }

  @Query((returns) => User)
  async user(
    @Arg("id") id: number,
    @Ctx() context: IContext
  ): Promise<User> {
    // Get the user by ID
    const user = await this.usersService.get(id);
    if (!user) {
        throw new ApolloError("User not found");
    }
    // This will authorize the user against cerbos or else through an authorization error

    const authorized = await context.loaders.authorize.load({
      actions: ["view"],
      resource: {
        id: user.id.toString(),
        kind: "user:object",
        attributes: {
            id: user.id,
            status: user.status.toString(),
            ownerId: user.personId,
        },
      },
    });
    
    // log.error();
    console.log(authorized);
    if (authorized.actions["view"] !== Effect.ALLOW) {
      throw new AuthorizationError("Access denied");
    }
    // Return the user
    return user;
  }
}

export default UsersQueries;