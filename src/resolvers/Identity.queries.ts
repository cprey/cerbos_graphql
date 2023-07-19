import { ApolloError } from "apollo-server-errors";
import { Arg, Ctx, Query } from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import { AuthorizationError, CerbosService } from "../services/Cerbos.service";
import { Effect, CheckResourcesResult } from "@cerbos/core";

import logger from "../utils/logger";
import { PersonsService } from "../services/Persons.service";
import Person from "../types/Person.type";

const log = logger("UsersQueries");

@Service()
class IdentityQueries {
  @Inject(() => CerbosService)
  private cerbosService: CerbosService;

  @Inject(() => PersonsService)
  private personsService: PersonsService;

  constructor() {
    log.info("created");
  }

  @Query((returns) => [Person])
  async identities(@Ctx() context: IContext): Promise<Person[]> {
    const persons = await this.personsService.list();
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

  @Query((returns) => Person)
  async identity(@Arg("id") id: number, @Ctx() context: IContext): Promise<Person> {
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
