import { ApolloServer } from "apollo-server";
import { buildSchema, registerEnumType, ResolverData } from "type-graphql";
import Container from "typedi";
import { UserRole, UserStatus } from "../data/users.data";

import logger from "../utils/logger";
import { authChecker } from "./auth-checker";
import { IContext } from "./context.interface";
import { PersonRole, PersonStatus } from "../data/persons.data";

const log = logger("ApolloServer");

export async function createGQLServer(
  createContextFn: Function,
): Promise<ApolloServer> {
  log.info("GraphQL schema building");
  try {
    registerEnumType(PersonRole, {
      name: "PersonRole", // this one is mandatory
      description: "The role the person has", // this one is optional
    });
    registerEnumType(PersonStatus, {
      name: "PersonStatus", // this one is mandatory
      description: "Status of the Person", // this one is optional
    });
    registerEnumType(UserRole, {
      name: "UserRole", // this one is mandatory
      description: "The role the user has", // this one is optional
    });
    registerEnumType(UserStatus, {
      name: "UserStatus", // this one is mandatory
      description: "Status of the User", // this one is optional
    });    
    const schema = await buildSchema({
      resolvers: [__dirname + "/../**/resolvers/*.{ts,js}"],
      container: ({ context }: ResolverData<IContext>) =>
        Container.of(context.requestId),
      authChecker: authChecker,
    });

    log.info("GraphQL schema built");

    const server = new ApolloServer({
      schema,
      introspection: true,
      csrfPrevention: true,
      context: createContextFn,
      logger: log,
      plugins: [
        {
          async requestDidStart(initialRequestContext) {
            return {
              async willSendResponse(requestContext) {
                log.debug(`dispose  ${requestContext.context.requestId}`);
                Container.reset(requestContext.context.requestId);
              }
            }
          }
        },
        // ApolloServerPluginLandingPageLocalDefault(),
      ],
    });
    log.info("GraphQL server created");
    return server;
  } catch (e) {
    log.error("GraphQL server failed");
    console.error(e);
  }
}
