import { Field, ObjectType } from "type-graphql";
import Person from "./Person.type";
import { UserStatus } from "../data/users.data";

@ObjectType()
export default class User {
  @Field()
  id: number;

  @Field()
  personId: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  status: UserStatus;
}
