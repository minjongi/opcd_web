import React from 'react';

const Button = ({label, className, ...props}) => {
    return (
        <div className={`button ${className}`} {...props}>
            <span>{label}</span>
        </div>
    )
}

export default Button;