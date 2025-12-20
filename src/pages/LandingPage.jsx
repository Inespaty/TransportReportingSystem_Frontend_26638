import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Footer from '../components/Footer';
import { AlertTriangle, LogIn, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import kigaliBus from '../assets/kigali-bus-new.jpg';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleReportIssue = () => {
        if (user) {
            navigate('/dashboard/feedbacks');
        } else {
            navigate('/login');
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans bg-slate-900 flex flex-col">
            {/* 🎥 Background Visual Section (Authentic Kigali Context) */}
            <div className="absolute inset-0 z-0 w-full">
                <img
                    src={kigaliBus}
                    alt="Kigali Public Transport"
                    className="h-full w-full object-cover object-bottom"
                />
                {/* 🎨 Balanced Gradient Overlay - Keeps the bus visible while maintaining readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-950/40 to-slate-900"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex flex-col flex-1">
                {/* Header */}
                <header className="flex w-full items-center justify-between px-2 py-4 md:px-7 backdrop-blur-sm bg-white/5 border-b border-white/10">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl font-black text-white">K</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white">
                            KTRS
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogin}
                        className="text-white hover:bg-white/10 hover:text-blue-400 transition-all duration-300 border border-white/10 rounded-xl px-6"
                    >
                        Sign In
                    </Button>
                </header>

                {/* Hero Section */}
                <main className="flex flex-col items-center justify-center px-6 py-20 md:py-32">
                    <div className="max-w-4xl text-center">
                        {/* Innovative Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
                            <Sparkles size={14} />
                            <span>Transforming Kigali's Commute</span>
                        </div>

                        <h1 className="mb-6 animate-fade-in text-5xl font-black leading-tight text-white md:text-8xl tracking-tight">
                            Kigali Transport <br />
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
                                Reporting System
                            </span>
                        </h1>
                        <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-300 md:text-xl md:leading-relaxed font-medium">
                            A centralized ecosystem designed for transparency, safety, and service excellence across Kigali's public transport network.
                        </p>

                        {/* Specialized Buttons called directly from the Button component */}
                        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                            <Button
                                preset="report-issue"
                                onClick={handleReportIssue}
                                className="w-full sm:w-auto"
                            />
                            <Button
                                preset="access-dashboard"
                                onClick={handleLogin}
                                className="w-full sm:w-auto"
                            />
                        </div>

                        {/* Integrated Partners Section */}
                        <div className="mt-32">
                            <p className="mb-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center justify-center gap-4 before:h-[1px] before:w-12 before:bg-slate-800 after:h-[1px] after:w-12 after:bg-slate-800">
                                Integrated Partners
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60">
                                {['KBS', 'RTFC', 'Royal Express'].map((partner) => (
                                    <span key={partner} className="text-3xl md:text-4xl font-black text-white hover:text-blue-400 hover:opacity-100 transition-all cursor-default tracking-tighter grayscale hover:grayscale-0">
                                        {partner}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>


                <Footer />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}} />
        </div>
    );
};

export default LandingPage;
