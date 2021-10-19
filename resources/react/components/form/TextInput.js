import React from 'react';

const TextInput = ({className, error, rows, ...props}) => {
    return (
        <div className="input-container">
            <div className={`text-input ${className || ''}`}>
                {rows ?
                    <textarea rows={rows} {...props}></textarea>
                    :
                    <input {...props} />
                }
                
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    )
}

export default TextInput;