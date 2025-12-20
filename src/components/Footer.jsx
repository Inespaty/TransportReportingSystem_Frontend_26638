import React from 'react';
import { Link } from 'react-router-dom';
import { BusFront, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <BusFront className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter">KTRS</span>
                    </div>

                    {/* Simple Navigation */}
                    <ul className="flex flex-wrap justify-center gap-6 md:gap-8">
                        <li>
                            <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                                Home
                            </Link>
                        </li>
                    </ul>

                    {/* Project Label */}
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-400">
                            Transport Reporting System
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-slate-600 text-xs">
                        &copy; {new Date().getFullYear()} Kigali Transport Reporting System. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
