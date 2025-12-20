import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import TokenStorage from '../utils/tokenStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = TokenStorage.getToken();
        const storedUser = TokenStorage.getUser();

        if (token && storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.isTwoFactorEnabled && !response.data.token) {
                return { requires2FA: true };
            }

            const { token, ...userData } = response.data;

            TokenStorage.setToken(token);
            TokenStorage.setUser(userData);
            setUser(userData);
            return userData;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, ...newUserData } = response.data;

            TokenStorage.setToken(token);
            TokenStorage.setUser(newUserData);
            setUser(newUserData);
            return newUserData;
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    };

    const verifyTwoFactor = async (email, code) => {
        try {
            const response = await api.post('/auth/verify-2fa', { email, code });
            const { token, ...userData } = response.data;

            TokenStorage.setToken(token);
            TokenStorage.setUser(userData);
            setUser(userData);
            return userData;
        } catch (error) {
            throw new Error(error.message || 'Verification failed');
        }
    };

    const logout = async () => {
        try {
            await TokenStorage.removeToken();
            TokenStorage.removeUser();
            setUser(null);
        } catch (error) {
            // Still clear local state even if API call fails
            TokenStorage.removeUser();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyTwoFactor, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
