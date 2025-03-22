import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../api/types/User';
import api from '../api/api';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const userId = localStorage.getItem('loggedInUserId');
            if (!user && userId) {
                try {
                    const response = await api.getLoggedInUser(userId);
                    if (response?.status === 200 && response.data?.data) {
                        setUser(response.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
            setIsLoading(false);
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
export type { AuthContextType };