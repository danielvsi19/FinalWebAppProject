import express from 'express';
import newsController from '../controllers/news_controller';

const router = express.Router();

router.get('/', newsController.getNews);

export default router;