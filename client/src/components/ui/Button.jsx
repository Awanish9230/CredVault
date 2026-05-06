import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-primary hover:bg-primary-light text-white shadow-[0_4px_20px_rgba(15,23,42,0.06)]",
        secondary: "bg-secondary-soft text-secondary hover:bg-blue-200",
        danger: "bg-red-50 text-error hover:bg-red-100",
        outline: "border border-border bg-white hover:bg-soft text-body"
    };

    return (
        <motion.button 
            whileTap={{ scale: 0.98 }}
            className={`${baseStyle} ${variants[variant]} ${className}`} 
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
