import { Service } from "typedi";
import { personById, Persons } from "../data/persons.data";
import Person from "../types/Person.type";
import logger from "../utils/logger";

const log = logger("PersonsService");

@Service({ global: true })
export class PersonsService {
  constructor() {
    log.info("created");
  }

  async list(): Promise<Person[]> {
    return Persons;
  }

  async get(id: number): Promise<Person> {
    return personById(id);
  }
}
