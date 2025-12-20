import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const TwoFactorPage = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyTwoFactor } = useAuth(); // Use context method for state update
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyTwoFactor(email, code);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid code');
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Error: No login context.</h2>
                    <p className="text-gray-600 mt-2">Please try logging in again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="form-container">
                <h2 className="form-header">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter the code sent to your email.
                </p>

                {error && (
                    <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
                        {error}
                    </div>
                )}

                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                        />
                    </div>
                    <div className="mt-4 w-full">
                        <Button type="submit" variant="primary" className="w-full justify-center">
                            Verify
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorPage;
