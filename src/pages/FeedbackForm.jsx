import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Send, Map, MapPin, Image as ImageIcon, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const FeedbackForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [formData, setFormData] = useState({
        companyId: '',
        title: '',
        description: '',
        issueCategory: 'OTHER',
        routeId: '',
        incidentLocationId: '',
        imageUrl: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [companiesRes, locationsRes] = await Promise.all([
                    api.get('/companies'),
                    api.get('/locations')
                ]);
                setCompanies(companiesRes.data);
                setLocations(locationsRes.data);
                setFilteredLocations(locationsRes.data);
            } catch (error) {
                console.error("Failed to fetch companies or locations", error);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch routes when company changes
    useEffect(() => {
        const fetchRoutes = async () => {
            if (!formData.companyId) {
                setRoutes([]);
                setFormData(prev => ({ ...prev, routeId: '' }));
                return;
            }
            try {
                const response = await api.get(`/routes/by-company/${formData.companyId}`);
                setRoutes(response.data);
            } catch (error) {
                console.error("Failed to fetch routes for company", error);
            }
        };
        fetchRoutes();
    }, [formData.companyId]);

    // Filter locations when route changes
    useEffect(() => {
        if (!formData.routeId) {
            setFilteredLocations(locations);
            return;
        }

        const selectedRoute = routes.find(r => r.routeId.toString() === formData.routeId.toString());
        if (selectedRoute && selectedRoute.district) {
            const districtName = selectedRoute.district.toLowerCase();
            const filtered = locations.filter(loc =>
                (loc.fullHierarchy && loc.fullHierarchy.toLowerCase().includes(districtName)) ||
                loc.locationName.toLowerCase().includes(districtName)
            );
            // If we found matches in the district, show them. Otherwise fallback to all.
            setFilteredLocations(filtered.length > 0 ? filtered : locations);
        } else {
            setFilteredLocations(locations);
        }
    }, [formData.routeId, locations, routes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.routeId || !formData.incidentLocationId) {
            alert("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            // Using URLSearchParams as the backend expects @RequestParam
            const params = new URLSearchParams();
            params.append('title', formData.title);
            params.append('description', formData.description);
            if (formData.imageUrl) params.append('imageUrl', formData.imageUrl);
            params.append('status', 'PENDING');
            params.append('issueCategory', formData.issueCategory);
            params.append('userId', user.userId);
            params.append('routeId', formData.routeId);
            // assignedUserId is omitted as it's optional and should be null for new reports
            params.append('incidentLocationId', formData.incidentLocationId);

            await api.post('/feedback', params);
            alert("Thank you! Your report has been submitted.");
            navigate('/dashboard/feedbacks');
        } catch (error) {
            console.error("Failed to submit feedback", error);
            alert("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { value: 'DELAY', label: 'Route Delay' },
        { value: 'OVERCROWDING', label: 'Overcrowding' },
        { value: 'SAFETY_ISSUE', label: 'Safety/Accident' },
        { value: 'ROUTE_CHANGE', label: 'Route Change' },
        { value: 'DRIVER_BEHAVIOR', label: 'Driver/Conductor Behavior' },
        { value: 'VEHICLE_CONDITION', label: 'Vehicle Condition' },
        { value: 'OTHER', label: 'Other' }
    ];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Report an Issue</h1>
                        <p className="text-slate-500">Submit feedback about a transport route or incident.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bus Company */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Bus Company</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                            value={formData.companyId}
                            onChange={(e) => setFormData({ ...formData, companyId: e.target.value, routeId: '' })}
                            required
                        >
                            <option value="">Select a company...</option>
                            {companies.map(company => (
                                <option key={company.companyId} value={company.companyId}>{company.companyName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Issue Category</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                            value={formData.issueCategory}
                            onChange={(e) => setFormData({ ...formData, issueCategory: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2 col-span-full">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Subject / Title</label>
                        <input
                            type="text"
                            placeholder="Brief summary of the issue"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Route */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <Map className="w-4 h-4 text-slate-400" /> Affected Route
                        </label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                            value={formData.routeId}
                            onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                            required
                            disabled={!formData.companyId}
                        >
                            {!formData.companyId ? (
                                <option value="">Select a company first</option>
                            ) : (
                                <>
                                    <option value="">Select a route...</option>
                                    {routes.map(route => (
                                        <option key={route.routeId} value={route.routeId}>{route.routeName} ({route.routeNumber})</option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" /> Incident Location
                        </label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                            value={formData.incidentLocationId}
                            onChange={(e) => setFormData({ ...formData, incidentLocationId: e.target.value })}
                            required
                        >
                            <option value="">{formData.routeId ? "Select approximate location in district..." : "Select approximate location..."}</option>
                            {filteredLocations.map(loc => (
                                <option key={loc.locationId} value={loc.locationId}>
                                    {loc.fullHierarchy || loc.locationName}
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-400 italic">Tip: You can select any administrative level (District, Sector, etc.) if exact village is unknown.</p>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Detailed Description</label>
                    <textarea
                        placeholder="Please describe what happened in detail..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium min-h-[150px]"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                {/* Image URL - For now just text, but styled nicely */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-slate-400" /> Evidence Image URL (Optional)
                    </label>
                    <input
                        type="url"
                        placeholder="Link to an image if available"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <AlertCircle className="w-4 h-4" />
                        <span>Your contact details will be shared with the transport authority.</span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => navigate('/dashboard')}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="flex items-center gap-2">
                            {loading ? 'Submitting...' : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Report
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
