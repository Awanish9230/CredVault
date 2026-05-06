import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && <label className="text-sm font-medium text-heading">{label}</label>}
            <input 
                ref={ref}
                className={`px-4 py-3 rounded-xl border bg-white text-body focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted
                ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-border focus:border-primary'}`}
                {...props}
            />
            {error && <span className="text-sm text-error mt-1">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
