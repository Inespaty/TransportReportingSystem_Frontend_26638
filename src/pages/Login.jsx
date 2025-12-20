import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(email, password);
            if (result.requires2FA) {
                navigate('/2fa', { state: { email } });
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="form-container">
                <h2 className="form-header">Sign In</h2>

                {error && <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">{error}</div>}

                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="form-input pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            <span
                                onClick={() => navigate('/forgot-password', { state: { email } })}
                                className="text-blue-600 hover:text-blue-500 cursor-pointer"
                            >
                                Forgot Password?
                            </span>
                        </p>
                    </div>
                    <div className="mt-4 w-full">
                        <div className="mt-4 w-full">
                            <Button type="submit" variant="primary" className="w-full justify-center">
                                Sign In
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <span onClick={() => navigate('/register')} className="text-blue-950 font-bold hover:underline cursor-pointer">
                            Register here
                        </span>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;
