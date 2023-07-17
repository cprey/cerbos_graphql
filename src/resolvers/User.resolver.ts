import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import { CerbosService } from "../services/Cerbos.service";
import { Effect } from "@cerbos/core";
import Person from "../types/Person.type";
import User from "../types/User.type";

import logger from "../utils/logger";

const log = logger("UsersResolver");

@Service()
@Resolver((of) => User)
class UsersResolver implements ResolverInterface<User> {
  @Inject(() => CerbosService)
  private cerbos: CerbosService;

  // Doesn't make sense - reuse for Fund access
  @FieldResolver()
  async person(@Root() user: User, @Ctx() context: IContext): Promise<Person> {
    // see if the user is allowed to see who approved it
    const authorized = await context.loaders.authorize.load({
      actions: ["view:approver"],
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
    return authorized["view:approver"] === Effect.ALLOW ? user.person : null;
  }
}

export default UsersResolver;
