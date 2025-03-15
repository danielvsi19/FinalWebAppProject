import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { User } from '../../api/types/User';
import { Post } from '../../api/types/Post';
import './UserPage.css';

export const UserPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<string>('');

    useEffect(() => {
        // Fetch user details and posts
        const fetchUserData = async () => {
            const userData = await api.getLoggedInUser();
            if (userData) {
                setUser(userData);
                setUsername(userData.username);
                setProfilePicture(userData.profilePicture || '');
                setPosts(userData.posts);
            }
        };
        fetchUserData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (user) {
            // Update user details
            await api.updateUser(user.id, { username, profilePicture });
            setIsEditing(false);
        }
    };

    return (
        <div className="user-page">
            <h1>User Page</h1>
            {user && (
                <div className="user-details">
                    <img className="profile-picture" src={profilePicture} alt="Profile" />
                    {isEditing ? (
                        <div className="edit-form">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                            />
                            <input
                                type="text"
                                value={profilePicture}
                                onChange={(e) => setProfilePicture(e.target.value)}
                                placeholder="Profile Picture URL"
                            />
                            <button onClick={handleSave}>Save</button>
                        </div>
                    ) : (
                        <div className="user-info">
                            <h2>{user.username}</h2>
                            <button onClick={handleEdit}>Edit</button>
                        </div>
                    )}
                    <h3>Posts</h3>
                    {posts && posts.length > 0 ? (
                        <ul className="posts-list">
                            {posts.map((post) => (
                                <li key={post.id} className="post-item">{post.title}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
            )}
        </div>
    );
};