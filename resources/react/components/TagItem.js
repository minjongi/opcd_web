import React from 'react';
import Icon from './Icon';

const TagItem = ({label, deletable, className, onDelete}) => {
    return (
        <div className={`op-tag-item ${className || ''}`}>
            <span className={`${deletable ? 'mr-2' : ''}`}>{label}</span>
            {deletable && 
                <span onClick={onDelete}><Icon name="close" /></span>
            }
        </div>
    )
}

export default TagItem;