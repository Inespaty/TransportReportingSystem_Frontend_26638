import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, FileText, Users, Building2, Map, AlertCircle } from 'lucide-react';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const response = await api.get(`/search?query=${query}`);
                setResults(response.data);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const getTypeIcon = (type) => {
        const typeLower = type?.toLowerCase() || '';
        if (typeLower.includes('user')) return Users;
        if (typeLower.includes('company')) return Building2;
        if (typeLower.includes('route')) return Map;
        return FileText;
    };

    const getTypeColor = (type) => {
        const typeLower = type?.toLowerCase() || '';
        if (typeLower.includes('user')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (typeLower.includes('company')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (typeLower.includes('route')) return 'bg-orange-100 text-orange-700 border-orange-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Search className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Search Results</h1>
                        <p className="text-slate-500 mt-1">
                            Found {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="font-semibold text-slate-700">{query}</span>"
                        </p>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="flex flex-col justify-center items-center p-16 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-slate-500">Searching...</p>
                </div>
            )}

            {!loading && results.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No results found</h3>
                    <p className="text-slate-500">Try adjusting your search query or check your spelling.</p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {results.map((result, index) => {
                            const Icon = getTypeIcon(result.type);
                            const colorClasses = getTypeColor(result.type);
                            return (
                                <div
                                    key={index}
                                    onClick={() => navigate(result.link)}
                                    className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 ${colorClasses} rounded-xl flex items-center justify-center border-2 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                    {result.title}
                                                </h3>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colorClasses}`}>
                                                    {result.type}
                                                </span>
                                            </div>
                                            {result.description && (
                                                <p className="text-sm text-slate-600 line-clamp-2">{result.description}</p>
                                            )}
                                        </div>
                                        <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
