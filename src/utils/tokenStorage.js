// Secure token storage utility
class TokenStorage {
    static setToken(token) {
        // Use httpOnly cookie in production, localStorage for development
        if (import.meta.env.MODE === 'production') {
            // In production, tokens should be set via secure httpOnly cookies from backend
            console.warn('Token should be set via secure httpOnly cookie in production');
        } else {
            localStorage.setItem('token', token);
        }
    }

    static getToken() {
        if (import.meta.env.MODE === 'production') {
            // Token will be automatically sent via httpOnly cookie
            return null; // Don't access from JS in production
        } else {
            return localStorage.getItem('token');
        }
    }

    static removeToken() {
        if (import.meta.env.MODE === 'production') {
            // Clear cookie via API call
            return fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } else {
            localStorage.removeItem('token');
        }
    }

    static setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static removeUser() {
        localStorage.removeItem('user');
    }
}

export default TokenStorage;