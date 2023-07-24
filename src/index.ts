import "reflect-metadata";

import { ExpressContext } from "apollo-server-express";
import createContext from "./server/create-context";
import { createGQLServer } from "./server/graphql-server";
import logger from "./utils/logger";

const log = logger("ApolloServer");

(async () => {
  const createContextFn = (request: ExpressContext) => createContext(request);
  const gqlServer = await createGQLServer(createContextFn);

  log.info(`Starting Environment: ${process.env.NODE_ENV}`);

  gqlServer.listen().then(({ url }) => {
    log.info(`Server ready at ${url}`);
  });
})().catch(console.error);
