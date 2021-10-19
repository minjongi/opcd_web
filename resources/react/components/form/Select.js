import React from 'react';

const Select = ({className, children, error, ...props}) => {
    return (
        <div className="select-container">
            <div className={`select ${className}`}>
                <select {...props} className={className && className.includes('rounded') ? 'rounded' : ''}>
                    {children}
                </select>
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    )
}

export default Select;