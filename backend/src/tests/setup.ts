import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
    if (!process.env.DB_URL_ENV) {
        throw new Error('DB_URL_ENV not set in environment');
    }
    await mongoose.connect(process.env.DB_URL_ENV);
});

afterAll(async () => {
    await mongoose.connection.close();
});