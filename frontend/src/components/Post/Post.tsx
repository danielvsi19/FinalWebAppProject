import React from 'react';
import { Card } from 'react-bootstrap';
import { Post } from '../../api/types/Post';
import './Post.css';

const PostComponent: React.FC<Post> = ({ title, content, image, createdAt, updatedAt }) => {
    return (
        <div className="post-component">
            <Card.Title>{title}</Card.Title>
            <Card.Text>{content}</Card.Text>
            {image && <Card.Img variant="top" src={image} alt={title} />}
            <Card.Text className="text-muted">
                Created at: {new Date(createdAt).toLocaleDateString()}
            </Card.Text>
            <Card.Text className="text-muted">
                Updated at: {new Date(updatedAt).toLocaleDateString()}
            </Card.Text>
        </div>
    );
};

export default PostComponent;