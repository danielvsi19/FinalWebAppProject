import React from 'react';

interface CommentProps {
    content: string;
    authorName: string;
};

const CommentComponent: React.FC<CommentProps> = ({ content, authorName }) => {
    return (
        <div className="comment">
            <h5>{authorName}</h5>
            <p>{content}</p>
        </div>
    );
};

export { CommentComponent } ; 