import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import api from '../../api/api';
import PostComponent from '../../components/Post/Post';
import { Post } from '../../api/types/Post';
import ScaleLoader from 'react-spinners/ScaleLoader';

export const UserPosts: React.FC = () => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (authContext?.user) {
                console.log("user", JSON.stringify(authContext.user._id));
                const response = await api.getLoggedInUserPosts(JSON.stringify(authContext.user._id));
                if (response && response.data) {
                    setPosts(response.data.data);
                }
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [authContext]);

    if (loading) {
        return <ScaleLoader color="black" />;
    }

    return (
        <div>
            <h1>User Posts</h1>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostComponent key={post._id} {...post} />
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};