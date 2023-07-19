import { Ctx, Query } from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import { CerbosService } from "../services/Cerbos.service";
import { Effect, CheckResourcesResult } from "@cerbos/core";

import logger from "../utils/logger";
import { PersonsService } from "../services/Persons.service";
import Identity from "../types/Identity.type";

const log = logger("IdentitiesQueries");

@Service()
class IdentitiesQueries {
  @Inject(() => CerbosService)
  private cerbosService: CerbosService;

  @Inject(() => PersonsService)
  private personsService: PersonsService;

  constructor() {
    log.info("created");
  }

  @Query((returns) => [Identity])
  async identities(@Ctx() context: IContext): Promise<Identity[]> {
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
}

export default IdentitiesQueries;
