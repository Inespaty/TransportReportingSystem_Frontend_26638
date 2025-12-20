import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'USER',
        locationId: '',
        companyId: '',
        isTwoFactorEnabled: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [locations, setLocations] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locRes, compRes] = await Promise.all([
                    api.get('/locations'),
                    api.get('/companies')
                ]);
                setLocations(locRes.data);
                setCompanies(compRes.data);
            } catch (err) {
                console.error("Failed to fetch dropdown data", err);
            }
        };
        fetchData();

        if (isEdit) {
            const fetchUser = async () => {
                try {
                    const response = await api.get(`/users/${id}`);
                    const user = response.data;
                    setFormData({
                        name: user.name,
                        email: user.email,
                        phone: user.phone || '',
                        role: user.role,
                        locationId: user.locationId || '',
                        companyId: user.companyId || '',
                        isTwoFactorEnabled: user.isTwoFactorEnabled || false,
                        password: ''
                    });
                } catch (err) {
                    console.error("Failed to fetch user", err);
                    setError("Failed to load user data");
                }
            };
            fetchUser();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await api.put(`/users/${id}`, null, { params: formData });
            } else {
                await api.post('/users', null, { params: formData });
            }
            navigate('/dashboard/users');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-10">
            <div className="form-container">
                <h2 className="form-header">{isEdit ? 'Edit User' : 'New User'}</h2>
                {error && <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">{error}</div>}

                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input className="form-input" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input className="form-input" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>

                    {!isEdit && (
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input className="form-input" type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                    )}

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select className="form-input" name="role" value={formData.role} onChange={handleChange} required>
                            <option value="USER">USER</option>
                            <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location {formData.role !== 'USER' ? '(Optional)' : ''}
                        </label>
                        <select
                            className="form-input"
                            name="locationId"
                            value={formData.locationId}
                            onChange={handleChange}
                            required={formData.role === 'USER'}
                        >
                            <option value="">Select Location</option>
                            {locations.map(loc => (
                                <option key={loc.locationId} value={loc.locationId}>
                                    {loc.fullHierarchy} ({loc.locationType})
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.role === 'COMPANY_ADMIN' && (
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <select className="form-input" name="companyId" value={formData.companyId} onChange={handleChange} required={formData.role === 'COMPANY_ADMIN'}>
                                <option value="">Select Company</option>
                                {companies.map(comp => (
                                    <option key={comp.companyId} value={comp.companyId}>
                                        {comp.companyName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="w-full flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="isTwoFactorEnabled"
                            name="isTwoFactorEnabled"
                            checked={formData.isTwoFactorEnabled}
                            onChange={(e) => setFormData({ ...formData, isTwoFactorEnabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="isTwoFactorEnabled" className="text-sm font-medium text-gray-700">
                            Enable Two-Factor Authentication (2FA)
                        </label>
                    </div>

                    <div className="mt-6 w-full">
                        <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
                            {loading ? 'Saving...' : 'Save User'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
