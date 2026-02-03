import React, { createContext, useContext, useState, useEffect } from 'react';
import { setPerformedByHeader } from '../api';

interface UserInfo {
    id: number;
    firstName: string;
    lastName: string;
    account: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: UserInfo | null;
    login: (user: UserInfo) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(() => {
        const savedUser = localStorage.getItem('mk_core_user');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        if (user) {
            setPerformedByHeader(user.account);
        }
    }, [user]);

    const login = (userInfo: UserInfo) => {
        setUser(userInfo);
        localStorage.setItem('mk_core_user', JSON.stringify(userInfo));
        setPerformedByHeader(userInfo.account);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mk_core_user');
        setPerformedByHeader(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
