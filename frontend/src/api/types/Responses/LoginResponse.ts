import { RegisteredUser } from "./RegisteredUser";

export interface LoginResponse {
    username: string;
    email: string;
    _id: string;
    token: string;
};