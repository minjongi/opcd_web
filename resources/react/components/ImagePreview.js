import React from 'react';
import Icon from './Icon';

const ImagePreview = ({url, format, className, deletable, onDelete}) => {
    return (
        <div className={`op-image-preview ${className || ''}`}>
            {format === 'mp4' ? 
                <video style={{width: '100%', height: '100%'}} controls>
                    <source src={url} type="video/mp4"/>
                </video>
                :
                <img className="fit-initial" src={url}/>
            }
            
            {deletable && 
                <div className="preview-overlay">
                    <Icon name="remove" onClick={onDelete}/>
                </div>
            }
        </div>
    )
}

export default ImagePreview;