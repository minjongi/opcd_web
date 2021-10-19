import React from 'react';

import Icon from './Icon';

const Avatar = ({url, className, editable, onChange, placeholder}) => {
    
    const handleChangeAvatar = (e) => {
        const { files } = e.target;
        if(!files.length) return;

        let file = files[0];
        onChange({
            file,
            preview: URL.createObjectURL(file)
        });
    }

    return (
        <div className={`avatar ${className || ''}`}>
            <div className="image-wrapper">
                <img src={url || '/images/icons/profile_avatar.png'}/>
            </div>
            {editable && 
                <label>
                    <input type="file" accept="image/*" hidden onChange={handleChangeAvatar}/>
                    <div className="edit-icon">
                        <Icon name="corg" />
                    </div>
                </label>
                
            }
        </div>
    )
}

export default Avatar;