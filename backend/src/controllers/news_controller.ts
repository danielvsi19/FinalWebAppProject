import { Request, Response, NextFunction } from 'express';
import NewsModel from '../models/news_model';
const { GoogleGenerativeAI } = require("@google/generative-ai");

interface NewsItem {
    title: string;
    content: string;
}

class NewsController {
    private static FETCH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    private genAI: any;
    private model: any;
    private prompt: string;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        this.prompt = `Generate 3 recent positive news stories. 
            Return them in the following JSON format, and ONLY the JSON:
            [
                {
                    "title": "First news title",
                    "content": "First news content"
                },
                {
                    "title": "Second news title",
                    "content": "Second news content"
                },
                {
                    "title": "Third news title",
                    "content": "Third news content"
                }
            ]`;
        this.getNews = this.getNews.bind(this);
        this.fetchFromGemini = this.fetchFromGemini.bind(this);
    }

    private async fetchFromGemini() {
        const result = await this.model.generateContent(this.prompt);
        const text = result.response.text();
        try {
            // Remove any potential markdown formatting and extract JSON
            const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
            const newsItems = JSON.parse(jsonStr) as NewsItem[];
            
            // Clean and format the news items
            return newsItems.map(item => ({
                title: this.formatText(item.title),
                content: this.formatText(item.content)
            }));
        } catch (error) {
            console.error('Error parsing Gemini response:', error);
            return null;
        }
    }

    private formatText(text: string): string {
        return text
            // Remove any remaining JSON formatting
            .replace(/["\[\]{}]/g, '')
            // Remove any escaped quotes
            .replace(/\\"/g, '"')
            // Remove any double spaces
            .replace(/\s+/g, ' ')
            // Trim whitespace
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
                const newsItems = await this.fetchFromGemini();
                
                if (newsItems && Array.isArray(newsItems)) {
                    // Clear old news
                    await NewsModel.deleteMany({});
                    // Insert new news items
                    await NewsModel.insertMany(newsItems);
                } else {
                    throw new Error('Failed to fetch valid news from Gemini');
                }
            }

            // Return current news from database
            const news = await NewsModel.find().sort({ createdAt: -1 });
            res.status(200).json(news);
        } catch (error: any) {
            console.error('News controller error:', error);
            next(error);
        }
    }
}

export default new NewsController();