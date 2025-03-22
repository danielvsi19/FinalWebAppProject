import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user_routes";
import postRoutes from "./routes/posts_routes";
import authRoutes from "./routes/auth_routes";
import commentRoutes from "./routes/comments_routes";
import newsRoutes from "./routes/news_routes";
import bodyParser from "body-parser";
import setupSwagger from "./swagger";
import cors from "cors";
import path from "path";
import https from 'https';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// SSL configuration
const sslOptions = {
    key: fs.readFileSync(path.resolve(__dirname, '../../certificates/private.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../../certificates/certificate.pem'))
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use("/comments", commentRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/news", newsRoutes);
app.get("/", (req, res) => {
  res.send("Hello world!");
});

setupSwagger(app);

if (!process.env.DB_URL_ENV) {
  console.error('DB_URL_ENV environment variable is not defined');
  process.exit(1);
}

mongoose.connect(process.env.DB_URL_ENV)
  .then(() => {
    console.log('Connected to MongoDB');
    if (require.main === module) {
      // Create HTTPS server
      const httpsServer = https.createServer(sslOptions, app);
      httpsServer.listen(PORT, () => {
        console.log(`Server is running on https://localhost:${PORT}`);
      });
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

export { app };

