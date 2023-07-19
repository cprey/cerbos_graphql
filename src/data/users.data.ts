import User from "../types/User.type";

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
    email: "test+001@gofundme.com",
    firstName: "Frodo",
    lastName: "Baggins",
    status: UserStatus.ACTIVE,
  },
  {
    id: 2,
    personId: 2,
    email: "test+002@gofundme.com",
    firstName: "Samwise",
    lastName: "Gamgee",
    status: UserStatus.ACTIVE,
  },
];

