import React from 'react';
import Icon from './Icon';

const PuzzleGallery = ({data, display, editable, onEdit, onDelete}) => {
    if(!data || !data.length) return null;

    const _data = data.filter(d => d.display === display);

    return (
        <div className="puzzle-gallery">
            <div className={`op-puzzle-gallery-container ${display === 'DESKTOP' ? 'desktop' : 'mobile'}`}>
                <div className="op-puzzle-gallery">
                    {_data.map((item, index) => 
                        <div key={index} className={`gallery-item item-${index} ${editable ? 'editable' : ''}`}>
                            {item.base_image && <img className="base-image" src={item.base_image}/>}
                                            
                            {item.type === 'SOON' && item.soon_image && 
                                <div className="overlay-wrapper">
                                    <img src={item.soon_image}/>
                                </div>
                            }

                            {item.type === 'LIVE' && item.live_image && 
                                <div className="overlay-wrapper">
                                    <img src={item.live_image}/>
                                </div>
                            }

                            {editable &&
                                <div className="edit-actions">
                                    <Icon name="edit" className="mr-2 cursor-pointer" onClick={() => onEdit(item)}/>
                                    <Icon name="remove" color="#ff4646" className="cursor-pointer" onClick={() => onDelete(item)}/>
                                </div>
                            }
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default PuzzleGallery;