import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user_model';
import PostModel from '../models/post_model';
import CommentModel from '../models/comments_model';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({ storage });

class UserController {
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserModel.findById(req.params.id)
                .select('-password -refreshTokens')
                .populate('posts')
                .populate('comments');
            
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error: any) {
            next(error);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserModel.find()
                .select('-password -refreshTokens')
                .populate('posts')
                .populate('comments');

            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error: any) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        const { username, email } = req.body;
        try {
            const existingUser = await UserModel.findOne({ 
                $or: [
                    { email, _id: { $ne: userId } },
                    { username, _id: { $ne: userId } }
                ]
            });

            if (existingUser) {
                res.status(400).json({ message: 'Username or email already in use' });
                return;
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            if (username) user.username = username;
            if (email) user.email = email;
            if (req.file) user.profilePicture = req.file.path;
            await user.save();
            
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error: any) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            await PostModel.deleteMany({ owner: userId });
            await CommentModel.deleteMany({ author: userId });
            await user.deleteOne();
            
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error: any) {
            next(error);
        }
    }
}

export default new UserController();