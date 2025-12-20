import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const RouteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get current user
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        routeNumber: '',
        startPoint: '',
        endPoint: '',
        companyId: ''
    });
    const [companies, setCompanies] = useState([]); // Store companies list
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If Company Admin, pre-fill companyId
        if (user?.role === 'COMPANY_ADMIN' && user?.company?.companyId) {
            setFormData(prev => ({ ...prev, companyId: user.company.companyId }));
        }

        // Fetch companies if Super Admin
        if (user?.role === 'SUPER_ADMIN') {
            const fetchCompanies = async () => {
                try {
                    const response = await api.get('/companies');
                    setCompanies(response.data);
                } catch (err) {
                    console.error("Failed to fetch companies", err);
                }
            };
            fetchCompanies();
        }

        if (isEdit) {
            const fetchRoute = async () => {
                try {
                    const response = await api.get(`/routes/${id}`);
                    const route = response.data;
                    setFormData({
                        routeNumber: route.routeNumber,
                        startPoint: route.startPoint || route.startLocation,
                        endPoint: route.endPoint || route.endLocation,
                        companyId: route.companyId || ''
                    });
                } catch (err) {
                    setError("Failed to load route data");
                }
            };
            fetchRoute();
        }
    }, [id, isEdit, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Ensure companyId is set for Company Admin if something went wrong with auto-fill
        if (user?.role === 'COMPANY_ADMIN' && !formData.companyId && user?.company?.companyId) {
            formData.companyId = user.company.companyId;
        }

        try {
            if (isEdit) {
                await api.put(`/routes/${id}`, formData);
            } else {
                await api.post('/routes', formData);
            }
            navigate('/dashboard/routes');
        } catch (err) {
            setError('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-10">
            <div className="form-container">
                <h2 className="form-header">{isEdit ? 'Edit Route' : 'New Route'}</h2>
                {error && <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">{error}</div>}

                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Route Number</label>
                        <input className="form-input" name="routeNumber" value={formData.routeNumber} onChange={handleChange} required />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Point</label>
                        <input className="form-input" name="startPoint" value={formData.startPoint} onChange={handleChange} required />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Point</label>
                        <input className="form-input" name="endPoint" value={formData.endPoint} onChange={handleChange} required />
                    </div>

                    {/* Company Selection Logic */}
                    {user?.role === 'SUPER_ADMIN' ? (
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <select className="form-input" name="companyId" value={formData.companyId} onChange={handleChange} required>
                                <option value="">Select Company</option>
                                {companies.map(comp => (
                                    <option key={comp.companyId} value={comp.companyId}>
                                        {comp.companyName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        // For Company Admin, hidden field or read-only display
                        // We can just rely on state, but good to debug maybe? Let's hide it.
                        <input type="hidden" name="companyId" value={formData.companyId} />
                    )}

                    <div className="mt-6 w-full">
                        <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Route'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RouteForm;
