import React, { useEffect, useState } from 'react';
import { Users, Building2, Map, ClipboardList, MapPin } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get('/dashboard/summary');
                setSummary(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                // Fallback to empty stats to allow rendering
                setSummary({
                    totalUsers: 0,
                    totalCompanies: 0,
                    totalRoutes: 0,
                    totalFeedbacks: 0,
                    pendingFeedbacks: 0,
                    resolvedFeedbacks: 0,
                    totalLocations: 0,
                    recentActivities: []
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const safeSummary = summary || {};

    const allStats = [
        { title: 'Total Users', value: safeSummary.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', role: ['SUPER_ADMIN'] },
        { title: 'Companies', value: safeSummary.totalCompanies, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', role: ['SUPER_ADMIN'] },
        { title: 'Active Routes', value: safeSummary.totalRoutes, icon: Map, color: 'text-sky-600', bg: 'bg-sky-50', role: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { title: 'Total Feedbacks', value: safeSummary.totalFeedbacks, icon: ClipboardList, color: 'text-slate-600', bg: 'bg-slate-50', role: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { title: 'Pending Issues', value: safeSummary.pendingFeedbacks, icon: ClipboardList, color: 'text-blue-700', bg: 'bg-blue-100', role: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { title: 'Resolved Issues', value: safeSummary.resolvedFeedbacks, icon: ClipboardList, color: 'text-indigo-700', bg: 'bg-indigo-100', role: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { title: 'Locations', value: safeSummary.totalLocations, icon: MapPin, color: 'text-blue-800', bg: 'bg-blue-50', role: ['SUPER_ADMIN'] },
        { title: 'My Reports', value: safeSummary.totalFeedbacks, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', role: ['USER'] },
        { title: 'Pending', value: safeSummary.pendingFeedbacks, icon: ClipboardList, color: 'text-yellow-600', bg: 'bg-yellow-50', role: ['USER'] },
        { title: 'Resolved', value: safeSummary.resolvedFeedbacks, icon: ClipboardList, color: 'text-green-600', bg: 'bg-green-50', role: ['USER'] },
    ];

    const stats = allStats.filter(stat => stat.role.includes(user?.role));
    const activities = safeSummary.recentActivities || [];

    return (
        <div className="pt-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
                    <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="hidden md:block text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Content Section */}
            <div className={`mt-8 grid grid-cols-1 ${user?.role === 'SUPER_ADMIN' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>

                {/* System Overview - Super Admin Only */}
                {user?.role === 'SUPER_ADMIN' && (
                    <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">System Overview</h3>
                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                Live Data
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Active Users</p>
                                        <p className="text-2xl font-bold text-slate-800">{safeSummary.totalUsers || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                                    <p className="text-xs text-slate-600 mb-1">Companies</p>
                                    <p className="text-xl font-bold text-slate-800">{safeSummary.totalCompanies || 0}</p>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                                    <p className="text-xs text-slate-600 mb-1">Routes</p>
                                    <p className="text-xl font-bold text-slate-800">{safeSummary.totalRoutes || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions - Company Admin & User */}
                {(user?.role === 'COMPANY_ADMIN' || user?.role === 'USER') && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between h-full">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {user?.role === 'COMPANY_ADMIN' && (
                                    <>
                                        <button
                                            onClick={() => navigate('/dashboard/routes/new')}
                                            className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <Map className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-slate-700 group-hover:text-blue-700">Add New Route</p>
                                                    <p className="text-xs text-slate-500">Create a new transport path</p>
                                                </div>
                                            </div>
                                            <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                                                →
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => navigate('/dashboard/feedbacks')}
                                            className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <ClipboardList className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-slate-700 group-hover:text-indigo-700">Pending Reports</p>
                                                    <p className="text-xs text-slate-500">View and resolve issues</p>
                                                </div>
                                            </div>
                                            <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                                                →
                                            </div>
                                        </button>
                                    </>
                                )}

                                {user?.role === 'USER' && (
                                    <button
                                        onClick={() => navigate('/dashboard/feedbacks/new')}
                                        className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ClipboardList className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-700 group-hover:text-blue-700">Report an Issue</p>
                                                <p className="text-xs text-slate-500">Submit feedback about a route</p>
                                            </div>
                                        </div>
                                        <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                                            →
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1 tracking-wider">
                                    {user?.role === 'USER' ? 'Did you know?' : 'Pro Tip'}
                                </p>
                                <p className="text-sm text-slate-600 italic">
                                    {user?.role === 'USER'
                                        ? '"Reporting issues helps improve public transport for everyone."'
                                        : '"Resolving feedback within 2 hours boosts company trust score."'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
