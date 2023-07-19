import { ApolloError } from "apollo-server-errors";
import { Arg, Ctx, Query } from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import { AuthorizationError, CerbosService } from "../services/Cerbos.service";
import { Effect } from "@cerbos/core";

import logger from "../utils/logger";
import { PersonsService } from "../services/Persons.service";
import Identity from "../types/Identity.type";

const log = logger("IdentityQueries");

@Service()
class IdentityQueries {
  @Inject(() => CerbosService)
  private cerbosService: CerbosService;

  @Inject(() => PersonsService)
  private personsService: PersonsService;

  constructor() {
    log.info("created");
  }

  @Query((returns) => Identity)
  async identity(@Arg("id") id: number, @Ctx() context: IContext): Promise<Identity> {
    // Get the user by ID
    const person = await this.personsService.get(id);
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
}

export default IdentityQueries;
