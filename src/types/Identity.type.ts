import { Field, ObjectType } from "type-graphql";
import { PersonRole, PersonStatus } from "../data/persons.data";
import User from "./User.type";
import Person from "./Person.type";

@ObjectType()
export default class Identity extends Person {

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  role: PersonRole; // MOVE THIS HERE??

}
