import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';

const CompanyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        companyName: '',
        contactEmail: '',
        description: '',
        contactInfo: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchCompany = async () => {
                try {
                    const response = await api.get(`/companies/${id}`);
                    setFormData(response.data);
                } catch (err) {
                    setError("Failed to load company data");
                }
            };
            fetchCompany();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await api.put(`/companies/${id}`, formData);
            } else {
                await api.post('/companies', formData);
            }
            navigate('/dashboard/companies');
        } catch (err) {
            setError('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-10">
            <div className="form-container">
                <h2 className="form-header">{isEdit ? 'Edit Company' : 'New Company'}</h2>
                {error && <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">{error}</div>}

                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input className="form-input" name="companyName" value={formData.companyName} onChange={handleChange} required />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <input className="form-input" type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                        <input className="form-input" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="form-input" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="mt-6 w-full">
                        <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Company'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyForm;
