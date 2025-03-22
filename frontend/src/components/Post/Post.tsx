import React, { useState, useEffect, useContext } from 'react';
import { Card } from 'react-bootstrap';
import { Post } from '../../api/types/Post';
import api from '../../api/api';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import './Post.css';

const PostComponent: React.FC<Post> = ({ _id, title, content, image, createdAt, likes, likedBy }) => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const [likesCount, setLikesCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(false);

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
        </div>
    );
};

export default PostComponent;