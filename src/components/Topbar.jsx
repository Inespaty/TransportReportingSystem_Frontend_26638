import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Settings, Info, Command } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Topbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Dynamic page title based on route
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (!path || path === 'dashboard') return 'Overview';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/dashboard/search?q=${searchQuery}`);
        }
    };

    return (
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40 px-8 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all duration-300">
            {/* 📍 Breadcrumbs / Dynamic Title */}
            <div className="flex items-center gap-4">
                <div className="hidden lg:flex flex-col">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {getPageTitle()}
                    </h2>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Console</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span className="text-blue-500">{getPageTitle()}</span>
                    </div>
                </div>
            </div>

            {/* 🔍 Innovative Search Bar */}
            <div
                className={`relative transition-all duration-500 ease-out flex items-center
                ${isSearchFocused ? 'w-[450px]' : 'w-80'}`}
            >
                <div className={`absolute left-4 z-10 p-1 rounded-md transition-colors ${isSearchFocused ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full pl-12 pr-12 py-3 bg-slate-100/50 border border-slate-200/50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400/50 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                />
                {!isSearchFocused && (
                    <div className="absolute right-4 hidden md:flex items-center gap-1 px-1.5 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400">
                        <Command size={10} />
                        <span>K</span>
                    </div>
                )}
            </div>



            {/* 👤 Profile Peek - Enhanced with Name & Role */}
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200 group cursor-pointer active:scale-[0.98] transition-all">
                <div className="flex flex-col items-end hidden sm:flex">
                    <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">
                        {user?.name}
                    </p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none">
                        {user?.role?.replace('_', ' ')}
                    </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-lg shadow-blue-500/15 group-hover:shadow-blue-500/30 transition-all">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-base">
                            {user?.name?.[0] || 'U'}
                        </div>
                    </div>
                </div>
            </div>

        </header>
    );
};

export default Topbar;
