import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import UserModel from '../models/user_model';
import PostModel from '../models/post_model';
import CommentsModel from '../models/comments_model';
import NewsModel from '../models/news_model';
import path from 'path';

describe('API Tests', () => {
    let authToken: string;
    let testUserId: string;
    let testPostId: string;

    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URL_ENV || '');
        await UserModel.deleteMany({});
        await PostModel.deleteMany({});
        await CommentsModel.deleteMany({});
        await NewsModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Auth Endpoints', () => {
        const testUser = {
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test123!'
        };

        it('should register a new user', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(testUser);
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe(testUser.email);
            testUserId = res.body.user._id;
        });

        it('should login user', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            authToken = res.body.token;
        });

        it('should fail with invalid credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
        });
    });

    describe('User Endpoints', () => {
        it('should get user profile', async () => {
            const res = await request(app)
                .get(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data._id).toBe(testUserId);
        });

        it('should update user profile', async () => {
            const res = await request(app)
                .put(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .field('username', 'updatedname')
                .attach('profilePicture', path.resolve(__dirname, '../test/test-image.jpg'));

            expect(res.status).toBe(200);
            expect(res.body.data.username).toBe('updatedname');
        });

        it('should fail to access without auth token', async () => {
            const res = await request(app)
                .get(`/users/${testUserId}`);

            expect(res.status).toBe(401);
        });
    });

    describe('Post Endpoints', () => {
        it('should create new post', async () => {
            const res = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .field('title', 'Test Post')
                .field('content', 'Test Content')
                .field('senderId', testUserId)
                .attach('image', path.resolve(__dirname, '../test/test-image.jpg'));

            expect(res.status).toBe(201);
            expect(res.body.title).toBe('Test Post');
            testPostId = res.body._id;
        });

        it('should get all posts', async () => {
            const res = await request(app)
                .get('/posts');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should like post', async () => {
            const res = await request(app)
                .post(`/posts/${testPostId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ userId: testUserId });

            expect(res.status).toBe(200);
            expect(res.body.likes).toBe(1);
            expect(res.body.likedBy).toContain(testUserId);
        });

        it('should unlike post', async () => {
            const res = await request(app)
                .post(`/posts/${testPostId}/unlike`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ userId: testUserId });

            expect(res.status).toBe(200);
            expect(res.body.likes).toBe(0);
            expect(res.body.likedBy).not.toContain(testUserId);
        });
    });

    describe('Comment Endpoints', () => {
        let testCommentId: string;

        it('should create comment', async () => {
            const res = await request(app)
                .post(`/comments/post/${testPostId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Test comment',
                    authorId: testUserId
                });

            expect(res.status).toBe(201);
            expect(res.body.content).toBe('Test comment');
            testCommentId = res.body._id;
        });

        it('should get post comments', async () => {
            const res = await request(app)
                .get(`/comments/post/${testPostId}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
        });
    });

    describe('News Endpoints', () => {
        it('should get news feed', async () => {
            const res = await request(app)
                .get('/news');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('should handle 404 routes', async () => {
            const res = await request(app)
                .get('/nonexistent');

            expect(res.status).toBe(404);
        });

        it('should handle validation errors', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'invalid',
                    password: '123'
                });

            expect(res.status).toBe(400);
        });

        it('should handle unauthorized access', async () => {
            const res = await request(app)
                .get(`/users/${testUserId}`)
                .set('Authorization', 'Bearer invalid');

            expect(res.status).toBe(401);
        });
    });
});