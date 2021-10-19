import React from 'react';

const CheckBox = ({label, append, className, ...props}) => {
    return (
        <div className={`checkbox-container ${className}`}>
            <label>
                <input  
                    type="checkbox"
                    {...props}
                />
                &nbsp;{label}
            </label>
            {!!append && append}
        </div>
        
    )
}

export default CheckBox;