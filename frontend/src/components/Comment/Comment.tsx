import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../api/api';
import './Comment.css';

interface CommentProps {
    content: string;
    authorName: string;
    postId?: string;
    onCommentAdded?: () => void;
};

const CommentComponent: React.FC<CommentProps> = ({ content, authorName, postId, onCommentAdded }) => {
    const authContext = useContext(AuthContext);
    const [newComment, setNewComment] = useState('');

    const handleCreateComment = async () => {
        if (!postId || !authContext?.user?._id) return;

        try {
            const response = await api.createComment(postId, newComment, authContext.user._id);
            if (response?.status === 201) {
                setNewComment(''); // Clear the input
                if (onCommentAdded) {
                    onCommentAdded(); // Refresh comments
                }
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    if (!content && !authorName) {
        // This is the comment form
        return (
            <div className="comment-form mb-4">
                <Form>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="mb-2"
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        onClick={handleCreateComment}
                        disabled={!newComment.trim()}
                        className="post-comment-btn"
                    >
                        Post Comment
                    </Button>
                </Form>
            </div>
        );
    }

    // This is a comment display
    return (
        <div className="comment">
            <h5>{authorName}</h5>
            <p>{content}</p>
        </div>
    );
};

export { CommentComponent };