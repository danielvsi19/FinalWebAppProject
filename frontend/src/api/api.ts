import axiosInstance from "./axiosInstance";
import { GetCommentsResponse } from "./types/Responses/GetCommentsResponse.ts";
import { GetLoggedInUserResponse } from "./types/Responses/GetLoggedInUserResponse";
import { GetPostsResponse } from "./types/Responses/GetPostsResponse.ts";
import { LikePostResponse } from "./types/Responses/LikePostResponse.ts";
import { LoginResponse } from "./types/Responses/LoginResponse";
import { RegisterResponse } from "./types/Responses/RegisterResponse";
import { UnlikePostResponse } from "./types/Responses/UnlikePostResponse.ts";
import { User } from "./types/User";
import axios, { AxiosResponse } from "axios";

const getData = async <T>(
    request: Promise<AxiosResponse<T, unknown>>
): Promise<AxiosResponse<T, unknown> | null> => {
    try {
        const response = await request;
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response as AxiosResponse<T, unknown>;
        }
        console.error(error);
        return null;
    }
};

export default {
    login(email: string, password: string): Promise<AxiosResponse<LoginResponse, unknown> | null> {
        return getData<LoginResponse>(axiosInstance.post<LoginResponse>('/auth/login', { email, password }));
    },
    googleLogin(token: string): Promise<AxiosResponse<LoginResponse, unknown> | null> {
        return getData<LoginResponse>(axiosInstance.post<LoginResponse>('/auth/google-login', {token }));
    },
    register(username: string, email: string, password: string): Promise<AxiosResponse<RegisterResponse, unknown> | null> {
        return getData<RegisterResponse>(axiosInstance.post<RegisterResponse>('/auth/register', { username, email, password }));
    },
    getUser(id: number): Promise<AxiosResponse<User, unknown> | null> {
        return getData<User>(axiosInstance.get<User>(`/users/${id}`));
    },
    getLoggedInUser(loggedInUserId: string): Promise<AxiosResponse<GetLoggedInUserResponse, unknown> | null> {
        return getData<GetLoggedInUserResponse>(axiosInstance.get<GetLoggedInUserResponse>("users/" + JSON.parse(loggedInUserId)));
    },
    updateUser(id: number, data: FormData): Promise<AxiosResponse<User, unknown> | null> {
        return getData<User>(axiosInstance.put<User>(`/user/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }));
    },
    getLoggedInUserPosts(loggedInUserId: string): Promise<AxiosResponse<GetPostsResponse, unknown> | null> {
        return getData<GetPostsResponse>(axiosInstance.get<GetPostsResponse>(`/posts/sender/${loggedInUserId}`));
    },
    likePost(postId: string, userId: string): Promise<AxiosResponse<LikePostResponse, unknown> | null> {
        return getData<LikePostResponse>(axiosInstance.post<LikePostResponse>(`/posts/${postId}/like`, { userId }));
    },
    unlikePost(postId: string, userId: string): Promise<AxiosResponse<UnlikePostResponse, unknown> | null> {
        return getData<UnlikePostResponse>(axiosInstance.post<UnlikePostResponse>(`/posts/${postId}/unlike`,  { userId }));
    },
    getCommentsByPostId(postId: string): Promise<AxiosResponse<GetCommentsResponse, unknown> | null> {
        return getData<GetCommentsResponse>(axiosInstance.get<GetCommentsResponse>(`/comments/post/${postId}`));
    },
};