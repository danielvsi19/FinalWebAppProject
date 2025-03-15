import axios, { AxiosResponse } from "axios";
import { User } from "./types/User";

const getData = async <T>(
    request: Promise<AxiosResponse<T, unknown>>
): Promise<T | null> => {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default {
    login(username: string, password: string): Promise<User | null> {
        return getData<User>(axios.post<User>('/auth/login', { username, password }));
    },
    register(username: string, email: string, password: string): Promise<User | null> {
        return getData<User>(axios.post<User>('/auth/register', { username, email, password }));
    },
    getUser(id: number): Promise<User | null> {
        return getData<User>(axios.get<User>(`/user/${id}`));
    },
    getLoggedInUser(): Promise<User | null> {
        return getData<User>(axios.get<User>('/user/me'));
    },
    updateUser(id: number, data: Partial<User>): Promise<User | null> {
        return getData<User>(axios.put<User>(`/user/${id}`, data));
    },
};