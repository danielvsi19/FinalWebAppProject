import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import PostModel from '../models/post_model';
import UserModel from '../models/user_model';

class PostController {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, content, senderId } = req.body;

            if (!title || !content || !senderId) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(senderId)) {
                res.status(400).json({ message: 'Invalid senderId' });
                return;
            }

            const post = new PostModel({
                title,
                content,
                senderId: new mongoose.Types.ObjectId(senderId),
                image: req.file?.path // Handle file upload if present
            });

            await post.save();

            // Add post reference to user
            await UserModel.findByIdAndUpdate(
                senderId,
                { $push: { posts: post._id } }
            );

            res.status(201).json(post);
        } catch (error: any) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const posts = await PostModel.find().sort({ createdAt: -1 }); // -1 for descending order
            res.status(200).json(posts);
        } catch (error: any) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                res.status(404).json({ message: 'Invalid post ID' });
                return;
            }
            const post = await PostModel.findById(req.params.id);
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
            res.status(200).json(post);
        } catch (error: any) {
            next(error);
        }
    }

    async getBySender(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const posts = await PostModel.find({ senderId: req.params.senderId });
            res.status(200).json(posts);
        } catch (error: any) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                res.status(404).json({ message: 'Invalid post ID' });
                return;
            }

            const updateData: any = {
                title: req.body.title,
                content: req.body.content,
            };

            // Handle image updates
            if (req.file) {
                // New image uploaded
                updateData.image = req.file.path;
            } else if (req.body.removeImage === 'true') {
                // Remove image
                updateData.image = '';
            }

            const post = await PostModel.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }

            res.status(200).json(post);
        } catch (error: any) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                res.status(404).json({ message: 'Invalid post ID' });
                return;
            }
            const post = await PostModel.findById(req.params.id);
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
            await post.deleteOne();
            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error: any) {
            next(error);
        }
    }
    
    async incrementLikes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const postId = req.params.id;
            const userId = req.body.userId;

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                res.status(400).json({ message: 'Invalid post ID' });
                return;
            }

            const post = await PostModel.findByIdAndUpdate(
                postId,
                { $inc: { likes: 1 }, $addToSet: { likedBy: userId } },
                { new: true }
            );

            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }

            res.status(200).json(post);
        } catch (error: any) {
            next(error);
        }
    }

    async decrementLikes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const postId = req.params.id;
            const userId = req.body.userId;

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                res.status(400).json({ message: 'Invalid post ID' });
                return;
            }

            const post = await PostModel.findByIdAndUpdate(
                postId,
                { $inc: { likes: -1 }, $pull: { likedBy: userId } },
                { new: true }
            );

            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }

            res.status(200).json(post);
        } catch (error: any) {
            next(error);
        }
    }
}

export default new PostController();
