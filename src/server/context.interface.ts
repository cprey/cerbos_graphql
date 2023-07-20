import { ExpressContext } from "apollo-server-express";
import DataLoader from "dataloader";
import { ResourceCheck, CheckResourcesResult } from "@cerbos/core";
import Person from "../types/Person.type";

export interface IContext {
  req: ExpressContext["req"];
  requestId: string;
  person: Person;
  loaders: {
    authorize: DataLoader<ResourceCheck, CheckResourcesResult, string>;
  };
}
