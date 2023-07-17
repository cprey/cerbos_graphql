import Person from "../types/Person.type";

export enum PersonRole {
  PERSON = "PERSON",
}

export enum PersonStatus {
  INACTIVE,
  ACTIVE
}

export const Persons: Person[] = [
  {
    id: 1,
    email: "test+001@gofundme.com",
    firstName: "Frodo",
    lastName: "Baggins",
    role: PersonRole.PERSON, // TODO how do we make this dynamic? IE look up roles and specify them by campaign??? Solve this first before implementing policy... I think we need a PersonService. 
    status: PersonStatus.ACTIVE
  },
  {
    id: 2,
    email: "test+002@gofundme.com",
    firstName: "Samwise",
    lastName: "Gamgee",
    role: PersonRole.PERSON,
    status: PersonStatus.ACTIVE
  },
];

export const personById = (id: number): Person => {
  return Persons.find((c) => c.id === id);
};
