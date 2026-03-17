import React from 'react';
import clsx from 'clsx';
import './Input.css';

const Input = ({
    type = 'text',
    placeholder,
    icon: Icon,
    rightElement,
    className,
    wrapperClassName,
    ...props
}) => {
    return (
        <div className={clsx('input-wrapper', wrapperClassName)}>
            {Icon && <Icon className="input-icon" size={20} />}
            <input
                type={type}
                className={clsx(
                    'input-field',
                    Icon && 'input-with-icon',
                    rightElement && 'input-with-right-element',
                    className
                )}
                placeholder={placeholder}
                {...props}
            />
            {rightElement && <div className="input-right-element">{rightElement}</div>}
        </div>
    );
};

export default Input;
