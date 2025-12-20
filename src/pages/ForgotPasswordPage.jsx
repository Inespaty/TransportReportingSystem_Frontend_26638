import React, { useState } from 'react';
import api from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/Button';

const ForgotPasswordPage = () => {
    const location = useLocation();
    const prepopulatedEmail = location.state?.email || '';
    const [email, setEmail] = useState(prepopulatedEmail);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const isEmailDisabled = !!location.state?.email && location.state?.email.trim() !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('/auth/forgot-password', null, { params: { email } });
            setMessage('If an account exists with that email, a reset link has been sent.');
        } catch (err) {
            setError('Failed to process request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="form-container">
                <h2 className="form-header">Forgot Password</h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {message && (
                    <div className="w-full bg-green-50 border-l-4 border-green-500 p-4 mb-4 text-green-700">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
                        {error}
                    </div>
                )}

                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className={`form-input ${isEmailDisabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly={isEmailDisabled}
                        />
                    </div>
                    <div className="mt-4 w-full">
                        <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
