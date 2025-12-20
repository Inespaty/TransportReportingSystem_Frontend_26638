import React, { useState } from 'react';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../services/api';
import Button from '../components/Button';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'USER',
        locationId: '',
        isTwoFactorEnabled: false
    });
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await api.get('/locations');
                setLocations(response.data);
            } catch (err) {
                console.error("Failed to fetch locations", err);
            }
        };
        fetchLocations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', formData);
            navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="form-container">
                <h2 className="form-header">Create Account</h2>

                {error && <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">{error}</div>}

                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <span className="flex items-center gap-2">
                                <MapPin size={16} className="text-blue-600" />
                                Residential Location
                            </span>
                        </label>
                        <select
                            name="locationId"
                            required
                            className="form-input"
                            value={formData.locationId}
                            onChange={handleChange}
                        >
                            <option value="">Select your location (Village level)</option>
                            {locations
                                .map(loc => (
                                    <option key={loc.locationId} value={loc.locationId}>
                                        {loc.fullHierarchy || loc.locationName}
                                    </option>
                                ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500 italic">Please select your exact village for better service reporting.</p>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="form-input pr-10"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="isTwoFactorEnabled"
                            name="isTwoFactorEnabled"
                            checked={formData.isTwoFactorEnabled}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="isTwoFactorEnabled" className="text-sm font-medium text-gray-700">
                            Enable Two-Factor Authentication (2FA)
                        </label>
                    </div>

                    <div className="mt-6 w-full">
                        <div className="mt-6 w-full">
                            <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
                                {loading ? 'Creating...' : 'Sign Up'}
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <span onClick={() => navigate('/login')} className="text-blue-950 font-bold hover:underline cursor-pointer">
                            Log in here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
