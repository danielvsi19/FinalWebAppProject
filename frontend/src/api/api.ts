import axiosInstance from "./axiosInstance";
import { LoginResponse } from "./types/Responses/LoginResponse";
import { RegisterResponse } from "./types/Responses/RegisterResponse";
import { User } from "./types/User";

import { AxiosResponse } from "axios";

const getData = async <T>(
    request: Promise<AxiosResponse<T, unknown>>
): Promise<AxiosResponse<T, unknown> | null> => {
    try {
        const response = await request;

        return response;
    } catch (error) {
        console.error(error);
        return null;
    };
};

export default {
    login(username: string, password: string): Promise<AxiosResponse<LoginResponse, unknown> | null> {
        return getData<LoginResponse>(axiosInstance.post<LoginResponse>('/auth/login', { username, password }));
    },
    register(username: string, email: string, password: string): Promise<AxiosResponse<RegisterResponse, unknown> | null> {
        return getData<RegisterResponse>(axiosInstance.post<RegisterResponse>('/auth/register', { username, email, password }));
    },
    getUser(id: number): Promise<AxiosResponse<User, unknown> | null> {
        return getData<User>(axiosInstance.get<User>(`/user/${id}`));
    },
};