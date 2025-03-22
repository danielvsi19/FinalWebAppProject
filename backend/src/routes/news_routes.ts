import express from 'express';
import newsController from '../controllers/news_controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 * /news:
 *   get:
 *     summary: Get latest news
 *     tags: [News]
 *     description: Retrieves the latest news item generated every 6 hours
 *     responses:
 *       200:
 *         description: Latest news item
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 *       500:
 *         description: Server error while fetching news
 */
router.get('/', newsController.getNews);

export default router;