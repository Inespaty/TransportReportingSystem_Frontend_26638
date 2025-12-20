import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import { MapPin, ChevronLeft } from 'lucide-react';

const LocationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        locationName: '',
        locationType: 'PROVINCE',
        parentLocationId: ''
    });

    const [parentLocations, setParentLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingParents, setFetchingParents] = useState(false);

    const locationTypes = ['PROVINCE', 'DISTRICT', 'SECTOR', 'CELL', 'VILLAGE'];

    useEffect(() => {
        if (isEdit) {
            const fetchLocation = async () => {
                try {
                    const response = await api.get(`/locations/${id}`);
                    const loc = response.data;
                    setFormData({
                        locationName: loc.locationName,
                        locationType: loc.locationType,
                        parentLocationId: loc.parentLocationId || ''
                    });
                } catch (error) {
                    console.error("Failed to fetch location", error);
                }
            };
            fetchLocation();
        }
    }, [id, isEdit]);

    useEffect(() => {
        const fetchParents = async () => {
            // Only fetch parents if not a province
            if (formData.locationType === 'PROVINCE') {
                setParentLocations([]);
                return;
            }

            setFetchingParents(true);
            try {
                // Determine previous type in hierarchy
                const typeIndex = locationTypes.indexOf(formData.locationType);
                if (typeIndex > 0) {
                    const parentType = locationTypes[typeIndex - 1];
                    const response = await api.get(`/locations/type/${parentType}`);
                    setParentLocations(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch parent locations", error);
            } finally {
                setFetchingParents(false);
            }
        };
        fetchParents();
    }, [formData.locationType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('locationName', formData.locationName);
            params.append('locationType', formData.locationType);
            params.append('parentLocationId', formData.parentLocationId || '');

            if (isEdit) {
                await api.put(`/locations/${id}`, null, { params });
            } else {
                await api.post('/locations', null, { params });
            }
            navigate('/dashboard/locations');
        } catch (error) {
            console.error("Failed to save location", error);
            alert("Error saving location. Please check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/dashboard/locations')}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Back to Locations</span>
            </button>

            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{isEdit ? 'Edit Location' : 'Add New Location'}</h2>
                            <p className="text-slate-500 text-sm">Define Kigali administrative boundaries</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Location Name</label>
                            <input
                                type="text"
                                required
                                value={formData.locationName}
                                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                placeholder="e.g. Nyarugenge"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Location Type</label>
                            <select
                                value={formData.locationType}
                                onChange={(e) => setFormData({ ...formData, locationType: e.target.value, parentLocationId: '' })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-white"
                            >
                                {locationTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {formData.locationType !== 'PROVINCE' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Parent {locationTypes[locationTypes.indexOf(formData.locationType) - 1]}
                                </label>
                                <select
                                    required
                                    value={formData.parentLocationId}
                                    onChange={(e) => setFormData({ ...formData, parentLocationId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-white disabled:opacity-50"
                                    disabled={fetchingParents}
                                >
                                    <option value="">Select Parent...</option>
                                    {parentLocations.map(loc => (
                                        <option key={loc.locationId} value={loc.locationId}>{loc.locationName}</option>
                                    ))}
                                </select>
                                {fetchingParents && <p className="text-xs text-blue-500 mt-2 animate-pulse">Loading parent locations...</p>}
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 rounded-xl shadow-lg shadow-blue-500/20"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update Location' : 'Create Location')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationForm;
