export interface Post {
    title: string;
    content: string;
    senderId: string;
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
    id: string;
  }