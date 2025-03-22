import React, { useState, useEffect, useContext } from 'react';
<<<<<<< HEAD
import { Card, Button, Modal, Form } from 'react-bootstrap';
=======
import { Card, Modal, Button } from 'react-bootstrap';
>>>>>>> a17759e9bf67dd3db81305efa03c30ec95f9b0a8
import { Post } from '../../api/types/Post';
import { Comment } from '../../api/types/Comment';
import { CommentComponent } from '../Comment/Comment';
import api from '../../api/api';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import './Post.css';

<<<<<<< HEAD
const PostComponent: React.FC<Post> = ({ _id, title: initialTitle, content: initialContent, image: initialImage, createdAt, likes, likedBy, senderId }) => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const [likesCount, setLikesCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedTitle, setEditedTitle] = useState(initialTitle);
    const [editedContent, setEditedContent] = useState(initialContent);
    const [editedImage, setEditedImage] = useState<File | null>(null);
    const [currentTitle, setCurrentTitle] = useState(initialTitle);
    const [currentContent, setCurrentContent] = useState(initialContent);
    const [currentImage, setCurrentImage] = useState(initialImage);
    const [isOwner, setIsOwner] = useState(false);
=======
const PostComponent: React.FC<Post> = ({ _id, title, content, image, createdAt, likes, likedBy, comments }) => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const [likesCount, setLikesCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [fetchedComments, setFetchedComments] = useState<Comment[]>([]);
>>>>>>> a17759e9bf67dd3db81305efa03c30ec95f9b0a8

    useEffect(() => {
        if (authContext?.user) {
            setIsOwner(authContext.user._id === senderId);
            setIsLiked(likedBy.includes(authContext.user._id));
        }
    }, [authContext, senderId, likedBy]);

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

    const getImageUrl = (imagePath: string) => {
        if (imagePath?.startsWith('http')) return imagePath;
        return `http://localhost:3000/${imagePath}`;
    };

    const handleEdit = async () => {
        try {
            const formData = new FormData();
            formData.append('title', editedTitle);
            formData.append('content', editedContent);
            
            // Handle image updates
            if (editedImage) {
                formData.append('image', editedImage);
            } else if (editedImage === null && currentImage) {
                // If editedImage is null and we had an image before, it means we want to remove it
                formData.append('removeImage', 'true');
            }

            const response = await api.updatePost(_id, formData);
            if (response?.status === 200 && response.data) {
                setShowEditModal(false);
                setCurrentTitle(editedTitle);
                setCurrentContent(editedContent);
                setCurrentImage(response.data.image || '');
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await api.deletePost(_id);
                if (response && response.status === 200) {
                    // Remove post from UI or trigger a refetch
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
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
            <Card.Title>{currentTitle}</Card.Title>
            <Card.Text>{currentContent}</Card.Text>
            {currentImage && (
                <Card.Img 
                    variant="top" 
                    src={getImageUrl(currentImage)} 
                    alt={currentTitle} 
                />
            )}
            <Card.Text className="text-muted">
                Created at: {new Date(createdAt).toLocaleDateString()}
            </Card.Text>
            <div className="post-actions d-flex justify-content-between align-items-center">
                <div className="likes-count">
                    <i
                        className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={isLiked ? handleUnlike : handleLike}
                    ></i> {likesCount}
                </div>
                {isOwner && (
                    <div className="owner-actions">
                        <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => setShowEditModal(true)}
                        >
                            <i className="bi bi-pencil"></i> Edit
                        </Button>
                        <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={handleDelete}
                        >
                            <i className="bi bi-trash"></i> Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            {currentImage && (
                                <div className="mb-2">
                                    <img 
                                        src={getImageUrl(currentImage)} 
                                        alt="Current" 
                                        style={{ maxWidth: '200px' }} 
                                        className="mb-2"
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="d-block"
                                        onClick={() => setEditedImage(null)}
                                    >
                                        Remove Image
                                    </Button>
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                onChange={(e) => setEditedImage(e.target.files?.[0] || null)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEdit}>
                        Save Changes
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