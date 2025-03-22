import { Post } from "../Post";

export interface GetPostsResponse {
    success: boolean;
    Posts: Post [];
};