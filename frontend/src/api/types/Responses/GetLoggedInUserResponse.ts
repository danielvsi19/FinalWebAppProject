import { User } from "../User";

export interface GetLoggedInUserResponse {
    success: boolean;
    user: User;
};