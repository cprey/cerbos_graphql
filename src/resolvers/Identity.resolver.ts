import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import { Effect } from "@cerbos/core";
import Person from "../types/Person.type";
import User from "../types/User.type";

import logger from "../utils/logger";
import { IdentityService } from "../services/Identity.service";
import { ApolloError } from "apollo-server-express";
import Identity from "../types/Identity.type";

const log = logger("IdentityResolver");

@Service()
@Resolver((of) => Identity)
class IdentityResolver implements ResolverInterface<Identity> {
  @Inject(() => IdentityService)
  private identityService: IdentityService;

  constructor() {
    log.info("created");
  }

  @FieldResolver()
  async user(
    @Root() person: Person,
    @Ctx() context: IContext,
  ): Promise<User | null> {
    const user = await this.identityService.user(person);
    if (!user) {
      throw new ApolloError("User not found");
    }
    return user;
    // @todo Does it make sense to even authorize this since we know that this user is owned by the person?
    // Seems like we should come up with a use case where someone might not be able to view these details? Also might be
    // Write uses cases are often better
    // Should also only be User.id and User.status. None of the other crap.
    // Showing Funds seems like the best option?
    // What about what is viewable to everywhere one vs just the CO vs stats???
    const authorized = await context.loaders.authorize.load({
      actions: ["view:user"],
      resource: {
        id: user.id.toString(),
        kind: "user:object",
        attributes: {
          id: user.id.toString(),
          status: user.status.toString(),
          ownerId: user.personId.toString(),
        },
      },
    });
    return authorized["view:user"] === Effect.ALLOW ? user : null;
  }
}

export default IdentityResolver;
