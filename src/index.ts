import "reflect-metadata";

import { ExpressContext } from "apollo-server-express";
import createContext from "./server/create-context";
import { createGQLServer } from "./server/graphql-server";
import logger from "./utils/logger";

async function init() {
  // const port = config.port || 8000;

  const createContextFn = (request: ExpressContext) => createContext(request);
  const gqlServer = await createGQLServer(createContextFn);
  const log = logger("ApolloServer");
  // const meta = {
  //   port: port,
  //   env: process.env.NODE_ENV,
  //   startedAt: startTime,
  //   node: process.env.NODE_NAME,
  //   pod: process.env.POD_NAME,
  // };
  log.info(`Starting Environment: ${process.env.NODE_ENV}`);

  gqlServer.listen().then(({ url }) => {
    log.info(`Server ready at ${url}`);
  });

}

init().catch(console.error);

// (async () => {
//   const server = new ApolloServer({
//     gateway,
//     engine: false,
//     subscriptions: false,
//   });

//   server.listen().then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);
//   });
// })();
