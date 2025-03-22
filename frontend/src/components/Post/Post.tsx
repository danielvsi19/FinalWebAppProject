import React from 'react';
import { Post } from '../../api/types/Post';

const PostComponent: React.FC<Post> = ({ id, title, content, createdAt, updatedAt }) => {
    return (
        <div className="post" id={id}>
            <h2>{title}</h2>
            <p>{content}</p>
            <div className="post-meta">
                <span>Created at: {createdAt.toLocaleString()}</span>
                <span>Updated at: {updatedAt.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default PostComponent;