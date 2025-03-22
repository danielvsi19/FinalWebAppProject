export interface Comment {
    _id: string;
    content: string;
    authorId: string;
    authorName: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
  };