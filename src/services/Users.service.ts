import { Service } from "typedi";
import { userById, Users } from "../data/users.data";
import User from "../types/User.type";
import logger from "../utils/logger";

const log = logger("UsersService");

@Service({ global: true })
export class UsersService {
  constructor() {
    log.info("created");
  }

  async list(): Promise<User[]> {
    return Users;
  }

  async get(id: number): Promise<User> {
    return userById(id);
  }
}
