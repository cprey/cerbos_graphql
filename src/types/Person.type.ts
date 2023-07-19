import { Field, ObjectType } from "type-graphql";
import { PersonRole, PersonStatus } from "../data/persons.data";

@ObjectType()
export default class Person {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  role: PersonRole; // @todo Move this into the Identity resolution type and figure out how to hide these other objects???

  @Field()
  status: PersonStatus;
}
