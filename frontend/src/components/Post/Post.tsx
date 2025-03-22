import React, { useState, useEffect, useContext } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import { Post } from '../../api/types/Post';
import { Comment } from '../../api/types/Comment';
import { CommentComponent } from '../Comment/Comment';
import api from '../../api/api';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import './Post.css';

const PostComponent: React.FC<Post> = ({ _id, title, content, image, createdAt, likes, likedBy, comments }) => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const [likesCount, setLikesCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [fetchedComments, setFetchedComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (authContext?.user && likedBy.includes(authContext.user._id)) {
            setIsLiked(true);
        }
    }, [authContext, likedBy]);

    const handleLike = async () => {
        try {
            const response = await api.likePost(_id, authContext?.user?._id!);
            if (response && response.data) {
                setLikesCount(response.data.likes);
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleUnlike = async () => {
        try {
            const response = await api.unlikePost(_id, authContext?.user?._id!);
            if (response && response.data) {
                setLikesCount(response.data.likes);
                setIsLiked(false);
            }
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    const handleShowComments = async () => {
        setShowComments(true);
        try {
            const response = await api.getCommentsByPostId(_id);
            console.log("comments", response?.data);
            if (response && response.data) {
                const mappedComments = response.data.map((comment: any) => ({
                    _id: comment._id,
                    content: comment.content,
                    authorName: comment.author.username,
                    createdAt: comment.createdAt,
                }));
                setFetchedComments(mappedComments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCloseComments = () => setShowComments(false);

    return (
        <div className="post-component">
            <Card.Title>{title}</Card.Title>
            <Card.Text>{content}</Card.Text>
            {image && <Card.Img variant="top" src={image} alt={title} />}
            <Card.Text className="text-muted">
                Created at: {new Date(createdAt).toLocaleDateString()}
            </Card.Text>
            <div className="likes-count">
                <i
                    className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}
                    style={{ color: 'red', cursor: 'pointer' }}
                    onClick={isLiked ? handleUnlike : handleLike}
                ></i> {likesCount}
            </div>
            <div 
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} 
                onClick={handleShowComments}
            >
                <i className="bi bi-chat-dots"></i> {comments.length} Show Comments
            </div>

            <Modal show={showComments} onHide={handleCloseComments}>
                <Modal.Header closeButton>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {fetchedComments.length > 0 ? (
                        fetchedComments.map((comment) => (
                            <CommentComponent 
                                key={comment._id} 
                                content={comment.content} 
                                authorName={comment.authorName} 
                            />
                        ))
                    ) : (
                        <p>No comments available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseComments}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PostComponent;