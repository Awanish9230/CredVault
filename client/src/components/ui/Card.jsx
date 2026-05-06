import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div 
            className={`bg-card rounded-2xl border border-border shadow-[0_4px_20px_rgba(15,23,42,0.06)] p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
