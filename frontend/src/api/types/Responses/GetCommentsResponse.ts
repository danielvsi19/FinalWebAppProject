export interface GetCommentsResponse {
    _id: string,
    content: string,
    auhtor: {
        _id: string,
        username: string,
    },
    post: string,
    createdAt: string,
};