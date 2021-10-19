import React from 'react';

const RadioBox = ({label, className, ...props}) => {
    return (
        <div className={`radiobox-container ${className}`}>
            <label>
                <input  
                    type="radio"
                    {...props}
                />
                &nbsp;{label}
            </label>
        </div>
        
    )
}

export default RadioBox;