import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import PostModel from '../models/post_model';
import UserModel from '../models/user_model';

class PostController {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, content, senderId } = req.body;

            if (!mongoose.Types.ObjectId.isValid(senderId)) {
                res.status(400).json({ message: 'Invalid senderId' });
                return;
            }

            const post = new PostModel({
                title,
                content,
                senderId: new mongoose.Types.ObjectId(senderId),
            });

            await post.save();

            await UserModel.findByIdAndUpdate(
                senderId,
                { $push: { posts: post._id } },
            );

            res.status(201).json(post);
        } catch (error: any) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const posts = await PostModel.find();
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
            const post = await PostModel.findByIdAndUpdate(
                req.params.id,
                req.body,
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
}

export default new PostController();
