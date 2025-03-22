export interface Post {
    title: string;
    content: string;
    image?: string;
    senderId: string;
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    likedBy: string[];
    _id: string;
  }