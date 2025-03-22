import React, { useEffect, useState, useContext } from 'react';
import './HomePage.css';
import axios from 'axios';
import { Card, Alert, Container, Row, Col, Pagination, Button, Modal, Form } from 'react-bootstrap';
import { Post } from '../../api/types/Post';
import PostComponent from '../../components/Post/Post';
import { AuthContext } from '../../contexts/AuthContext';

interface NewsItem {
    title: string;
    content: string;
    createdAt: Date;
}

const POSTS_PER_PAGE = 5;

const HomePage: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState<File | null>(null);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchNews = async () => {
        try {
            const response = await axios.get('https://localhost:3000/news');
            setNews(response.data);
        } catch (error: any) {
            console.error('Error fetching news:', error);
            setError('Failed to fetch news. Please try again later.');
        }
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://localhost:3000/posts');
            const allPosts = response.data;
            setPosts(allPosts);
            setTotalPages(Math.ceil(allPosts.length / POSTS_PER_PAGE));
        } catch (error: any) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        try {
            const formData = new FormData();
            formData.append('title', newPostTitle);
            formData.append('content', newPostContent);
            formData.append('senderId', authContext?.user?._id || '');
            if (newPostImage) {
                formData.append('image', newPostImage);
            }

            // Get token and properly format the Authorization header
            const token = JSON.parse(localStorage.getItem('token') || '""');
            const response = await axios.post('https://localhost:3000/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Make sure it's "Bearer "
                }
            });

            if (response.status === 201) {
                setShowCreateModal(false);
                setNewPostTitle('');
                setNewPostContent('');
                setNewPostImage(null);
                // Refresh posts
                await fetchPosts();
            }
        } catch (error: any) {
            console.error('Error creating post:', error);
            setError(error.response?.data?.message || 'Failed to create post. Please try again later.');
        }
    };

    useEffect(() => {
        Promise.all([fetchNews(), fetchPosts()]);
    }, []);

    // Get current posts for pagination
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    return (
        <div className="homepage">
            <header className="homepage-header">
                <h1>Welcome to Barker</h1>
            </header>

            <main className="homepage-main">
                <Container fluid>
                    <Row>
                        <Col md={8} className="posts-section">
                            {/* Create Post Modal */}
                            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Create New Post</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter post title"
                                                value={newPostTitle}
                                                onChange={(e) => setNewPostTitle(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Content</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="What's on your mind?"
                                                value={newPostContent}
                                                onChange={(e) => setNewPostContent(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Image (optional)</Form.Label>
                                            <Form.Control
                                                type="file"
                                                onChange={(e) => setNewPostImage(e.target.files?.[0] || null)}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleCreatePost}>
                                        Create Post
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {/* Existing posts display */}
                            {loading ? (
                                <p className="text-center">Loading posts...</p>
                            ) : (
                                <>
                                    {currentPosts.map((post) => (
                                        <Card key={post._id} className="mb-4 post-card">
                                            <Card.Body>
                                                <PostComponent {...post} />
                                            </Card.Body>
                                        </Card>
                                    ))}
                                    
                                    {/* Pagination */}
                                    <div className="d-flex justify-content-center mt-4">
                                        <Pagination>
                                            <Pagination.First 
                                                onClick={() => handlePageChange(1)}
                                                disabled={currentPage === 1}
                                            />
                                            <Pagination.Prev 
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            />
                                            
                                            {[...Array(totalPages)].map((_, idx) => (
                                                <Pagination.Item
                                                    key={idx + 1}
                                                    active={idx + 1 === currentPage}
                                                    onClick={() => handlePageChange(idx + 1)}
                                                >
                                                    {idx + 1}
                                                </Pagination.Item>
                                            ))}
                                            
                                            <Pagination.Next 
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            />
                                            <Pagination.Last 
                                                onClick={() => handlePageChange(totalPages)}
                                                disabled={currentPage === totalPages}
                                            />
                                        </Pagination>
                                    </div>
                                </>
                            )}
                        </Col>

                        {/* News Section */}
                        <Col md={4}>
                            <div className="news-section">
                                <h2 className="text-center h5 mb-4">Today's Happy News</h2>

                                {error && (
                                    <Alert variant="warning" className="mb-4">
                                        {error}
                                    </Alert>
                                )}

                                <div className="news-grid">
                                    {news.map((item, index) => (
                                        <Card key={index} className="news-card mb-3">
                                            <Card.Body>
                                                <Card.Title className="h6">{item.title}</Card.Title>
                                                <Card.Text className="small">{item.content}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <div className="floating-create-btn">
    <Button 
        variant="primary" 
        size="lg" 
        className="create-post-btn"
        onClick={() => setShowCreateModal(true)}
    >
        <i className="bi bi-plus-circle"></i> Create New Post
    </Button>
</div>
            </main>
        </div>
    );
};

export default HomePage;