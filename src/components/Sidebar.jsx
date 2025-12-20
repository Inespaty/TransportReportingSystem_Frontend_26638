import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Users, Building2, Map,
    ClipboardList, LogOut, ChevronLeft, ChevronRight,
    BusFront, ShieldCheck, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    ];

    if (user?.role === 'SUPER_ADMIN') {
        navItems.push(
            { name: 'Users', icon: Users, path: '/dashboard/users' },
            { name: 'Companies', icon: Building2, path: '/dashboard/companies' },
            { name: 'Routes', icon: Map, path: '/dashboard/routes' },
            { name: 'Feedbacks', icon: ClipboardList, path: '/dashboard/feedbacks' },
            { name: 'Locations', icon: MapPin, path: '/dashboard/locations' }
        );
    } else if (user?.role === 'COMPANY_ADMIN') {
        navItems.push(
            { name: 'Routes', icon: Map, path: '/dashboard/routes' },
            { name: 'Feedbacks', icon: ClipboardList, path: '/dashboard/feedbacks' }
        );
    } else if (user?.role === 'USER') {
        navItems.push(
            { name: 'My Feedback', icon: ClipboardList, path: '/dashboard/feedbacks' }
        );
    }

    return (
        <aside
            className={`relative min-h-screen ${isCollapsed ? 'w-24' : 'w-72'} 
            bg-[#0f172a] backdrop-blur-xl text-white flex flex-col transition-all duration-500 ease-in-out
            border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.3)] z-50`}
        >
            {/* 🎒 Toggle Button - Innovative Floating Placement */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 bg-blue-600 hover:bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-transform active:scale-95 group"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* 🏛 Brand Section - Ultra Modern */}
            <div className="p-8 pb-10">
                <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 ring-1 ring-white/20">
                        <BusFront className="w-8 h-8 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="animate-fade-in whitespace-nowrap">
                            <h1 className="text-2xl font-black tracking-tighter text-white">
                                KTRS
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                                Transport Admin
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 🚀 Navigation - Modern Glassy Items */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-hidden">
                {!isCollapsed && (
                    <p className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                        Main Menu
                    </p>
                )}
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
                        }
                    >
                        <item.icon className={`w-5 h-5 transition-all duration-300 ${isCollapsed ? 'mx-auto w-6 h-6' : ''}`} />
                        {!isCollapsed && (
                            <span className="font-semibold text-sm tracking-tight transition-opacity duration-300">
                                {item.name}
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
                                {item.name}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* 👤 User Card / Bottom Section */}
            <div className="p-4 border-t border-white/5 mt-auto">
                <button
                    onClick={logout}
                    className={`flex items-center gap-4 px-4 py-4 w-full rounded-2xl transition-all duration-300
                    text-slate-400 hover:bg-red-500/10 hover:text-red-400 group 
                    ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    {!isCollapsed && <span className="font-bold text-sm tracking-wide">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
