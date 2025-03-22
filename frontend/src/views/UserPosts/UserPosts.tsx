import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import api from '../../api/api';
import PostComponent from '../../components/Post/Post';
import { Post } from '../../api/types/Post';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './UserPosts.css';

export const UserPosts: React.FC = () => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (authContext?.user) {
                console.log("user", authContext.user._id);
                const response = await api.getLoggedInUserPosts(authContext.user._id);
                if (response && response.data) {
                    console.log("posts", response.data);
                    setPosts(response.data);
                    setLoading(false);
                }
            }
        };

        fetchUserPosts();
    }, [authContext]);

    if (loading) {
        return <ScaleLoader color="black" className='spinner' height={50} width={50}/>;
    }

    return (
        <Container className="user-posts-container">
            <h1 className="text-center mb-4">{authContext?.user?.username + "'s Posts"}</h1>
            <Row className="justify-content-center">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Col key={post._id} md={6} lg={4} className="mb-4">
                            <Card className="post-card">
                                <Card.Body>
                                    <PostComponent {...post} />
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </Row>
        </Container>
    );
};