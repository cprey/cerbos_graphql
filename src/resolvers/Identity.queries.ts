import { ApolloError } from "apollo-server-errors";
import { Arg, Ctx, Query } from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import { AuthorizationError } from "../services/Authorization.service";
import { Effect, CheckResourcesResult } from "@cerbos/core";

import logger from "../utils/logger";
import { IdentityService } from "../services/Identity.service";
import Identity from "../types/Identity.type";

const log = logger("IdentityQueries");

@Service()
class IdentityQueries {
  constructor(private readonly identityService: IdentityService) {
    log.info("created");
  }

  // @todo
  // identity - without id should resolve from context and authorize against principle
  // identity - with id(s) should resolve from id and authorize ???
  // We should be able to handle anonymous users as well???

  @Query((returns) => Identity)
  async whoami(@Ctx() context: IContext): Promise<Identity> {
    const person = context.person;
    // This will authorize the user against cerbos or else through an authorization error
    const authorized = await context.loaders.authorize.load({
      actions: ["view"],
      resource: {
        id: person.id.toString(),
        kind: "person:object",
        attributes: {
          id: person.id.toString(),
          status: person.status.toString(),
          ownerId: person.id.toString(),
        },
      },
    });
    if (authorized.actions["view"] !== Effect.ALLOW) {
      throw new AuthorizationError("Access denied");
    }
    // Return the user
    return person;
  }

  @Query((returns) => Identity)
  async identity(
    @Arg("id") id: number,
    @Ctx() context: IContext,
  ): Promise<Identity> {
    // Get the user by ID
    const person = await this.identityService.get(id);
    if (!person) {
      throw new ApolloError("Person not found");
    }
    // This will authorize the user against cerbos or else through an authorization error
    const authorized = await context.loaders.authorize.load({
      actions: ["view"],
      resource: {
        id: person.id.toString(),
        kind: "person:object",
        attributes: {
          id: person.id.toString(),
          status: person.status.toString(),
          ownerId: person.id.toString(),
        },
      },
    });
    if (authorized.actions["view"] !== Effect.ALLOW) {
      throw new AuthorizationError("Access denied");
    }
    // Return the user
    return person;
  }

  @Query((returns) => [Identity])
  async identities(@Ctx() context: IContext): Promise<Identity[]> {
    const persons = await this.identityService.list();
    const action = "view";
    const authorized = await context.loaders.authorize.loadMany(
      persons.map((person) => {
        return {
          actions: [action],
          resource: {
            id: person.id.toString(),
            kind: "person:object",
            attributes: {
              id: person.id,
              status: person.status.toString(),
              ownerId: person.id,
            },
          },
        };
      }),
    );
    return persons.filter(
      (_, i) =>
        (authorized[i] as CheckResourcesResult).actions[action] ===
        Effect.ALLOW,
    );
  }
}

export default IdentityQueries;
