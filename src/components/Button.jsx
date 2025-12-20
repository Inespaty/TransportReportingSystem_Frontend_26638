import React from 'react';
import { AlertTriangle, LogIn } from 'lucide-react';

const PRESETS = {
    'report-issue': {
        variant: 'premium',
        icon: <AlertTriangle className="w-5 h-5" />,
        text: 'Report an Issue'
    },
    'access-dashboard': {
        variant: 'glass',
        icon: <LogIn className="w-5 h-5 text-blue-400" />,
        text: 'Access Dashboard'
    }
};

const Button = ({ children, preset, variant = 'primary', size = 'md', className = '', disabled, ...props }) => {
    const config = PRESETS[preset] || {};
    const finalVariant = preset ? config.variant : variant;

    const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none";

    const sizeStyles = {
        sm: "px-4 py-2 text-sm",
        md: "px-8 py-4 text-base",
        lg: "px-12 py-5 text-xl"
    };

    const variants = {
        primary: "bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20",
        premium: "bg-blue-600 text-white shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.6)] relative overflow-hidden group",
        glass: "bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 hover:border-blue-500/50",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline: "border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
        ghost: "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
    };

    const finalChildren = children || (preset ? (
        <>
            {config.icon}
            <span>{config.text}</span>
        </>
    ) : null);

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${variants[finalVariant]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {finalVariant === 'premium' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            <div className={`relative flex items-center justify-center gap-2 ${finalVariant === 'premium' ? 'z-10' : ''}`}>
                {finalChildren}
            </div>
        </button>
    );
};

export default Button;
