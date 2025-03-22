import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  image?: string,
  senderId: Schema.Types.ObjectId;
  comments: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  likedBy: Schema.Types.ObjectId[];
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 255 },
  content: { type: String, required: true, trim: true, minlength: 1 },
  image: { type: String },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

postSchema.index({ senderId: 1, createdAt: -1 });

const Post = model<IPost>('Post', postSchema);
export default Post;