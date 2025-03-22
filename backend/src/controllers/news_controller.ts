import { Request, Response, NextFunction } from 'express';
import NewsModel from '../models/news_model';
const { GoogleGenerativeAI } = require("@google/generative-ai");

interface NewsItem {
    title: string;
    content: string;
}

class NewsController {
    private static FETCH_INTERVAL = 6 * 60 * 60 * 1000;
    private genAI: any;
    private model: any;
    private prompt: string;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        this.prompt = `Generate 1 recent positive news story. 
            Return it in the following JSON format, and ONLY the JSON:
            {
                "title": "News title",
                "content": "News content"
            }`;
        this.getNews = this.getNews.bind(this);
        this.fetchFromGemini = this.fetchFromGemini.bind(this);
    }

    private async fetchFromGemini() {
        const result = await this.model.generateContent(this.prompt);
        const text = result.response.text();
        try {
            const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
            const newsItem = JSON.parse(jsonStr) as NewsItem;
            
            return {
                title: this.formatText(newsItem.title),
                content: this.formatText(newsItem.content)
            };
        } catch (error) {
            console.error('Error parsing Gemini response:', error);
            return null;
        }
    }

    private formatText(text: string): string {
        return text
            .replace(/["\[\]{}]/g, '')
            .replace(/\\"/g, '"')
            .replace(/\s+/g, ' ')
            .trim();
    }

    private async shouldFetchNews(): Promise<boolean> {
        const lastNews = await NewsModel.findOne().sort({ createdAt: -1 });
        if (!lastNews) return true;

        const now = new Date();
        const lastFetchTime = lastNews.createdAt;
        return now.getTime() - lastFetchTime.getTime() > NewsController.FETCH_INTERVAL;
    }

    async getNews(req: Request, res: Response, next: NextFunction) {
        try {
            const shouldFetch = await this.shouldFetchNews();
            
            if (shouldFetch) {
                const newsItem = await this.fetchFromGemini();
                
                if (newsItem) {
                    // Clear old news
                    await NewsModel.deleteMany({});
                    // Insert new news item
                    await NewsModel.create(newsItem);
                } else {
                    throw new Error('Failed to fetch valid news from Gemini');
                }
            }

            // Return current news from database
            const news = await NewsModel.findOne().sort({ createdAt: -1 });
            res.status(200).json([news]);
        } catch (error: any) {
            console.error('News controller error:', error);
            next(error);
        }
    }
}

export default new NewsController();