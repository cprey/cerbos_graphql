import { Service } from "typedi";
import { Persons } from "../data/persons.data";
import Person from "../types/Person.type";
import logger from "../utils/logger";
import User from "../types/User.type";
import { Users } from "../data/users.data";

const log = logger("IdentityService");

@Service({ global: true })
export class IdentityService {
  constructor() {
    log.info("created");
  }

  async list(): Promise<Person[]> {
    return Persons;
  }

  async get(id: number): Promise<Person> {
    return Persons.find((p) => p.id === id);
  }

  async user(person: Person): Promise<User | null> {
    return Users.find((u) => u.personId === person.id) ?? null;
  }
}
