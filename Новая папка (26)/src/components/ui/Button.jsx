import React from 'react';
import clsx from 'clsx';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    icon: Icon,
    ...props
}) => {
    return (
        <button
            className={clsx('btn', `btn-${variant}`, `btn-${size}`, className)}
            {...props}
        >
            {Icon && <Icon size={18} className="btn-icon" />}
            {children}
        </button>
    );
};

export default Button;
