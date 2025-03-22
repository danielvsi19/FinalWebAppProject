import React, { useEffect, useState } from 'react';
import './HomePage.css';
import axios from 'axios';
import { Card, Alert } from 'react-bootstrap';

interface NewsItem {
    title: string;
    content: string;
    createdAt: Date;
}

const HomePage: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:3000/news');
            setNews(response.data);
        } catch (error: any) {
            console.error('Error fetching news:', error);
            setError('Failed to fetch news. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="homepage">
            <header className="homepage-header">
                <h1>Welcome to the Home Page</h1>
            </header>

            <main className="homepage-main">
                <div className="news-section">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Today's Happy News</h2>
                    </div>

                    {error && (
                        <Alert variant="warning" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <p>Loading news...</p>
                    ) : (
                        <div className="news-grid">
                            {news.map((item, index) => (
                                <Card key={index} className="news-card">
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Text>{item.content}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="posts-box">
                        <textarea placeholder="What's happening?" />
                        <button>Tweet</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;