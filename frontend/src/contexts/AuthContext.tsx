import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../api/types/User';
import api from '../api/api';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!user || !user._id) {
                const response = (await api.getLoggedInUser(localStorage.getItem('loggedInUserId')!));

                if (response && response.status === 200) {
                    setUser(response.data.data);
                }
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
export type { AuthContextType };