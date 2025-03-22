import { User } from "../User";

export type RegisteredUser = Pick<User, "username" | "email" | "_id">;
