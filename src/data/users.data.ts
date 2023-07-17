import User from "../types/User.type";
import { personById } from "./persons.data";

export enum UserRole {
  USER = "USER",
  ORGANIZER = "ORGANIZER",
  TEAM_MEMBER = "TEAM_MEMBER",
  BENEFICIARY = "BENEFICIARY",
}

export enum UserStatus {
  INACTIVE,
  ACTIVE,
}

export const Users: User[] = [
  {
    id: 1,
    personId: 1,
    person: personById(1),
    email: "test+001@gofundme.com",
    firstName: "Frodo",
    lastName: "Baggins",
    status: UserStatus.ACTIVE,
  },
  {
    id: 2,
    personId: 2,
    person: personById(2),
    email: "test+002@gofundme.com",
    firstName: "Samwise",
    lastName: "Gamgee",
    status: UserStatus.ACTIVE,
  },
];

export const userById = (id: number): User => {
  return Users.find((c) => c.id === id);
};
