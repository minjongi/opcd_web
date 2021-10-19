import React from 'react';
import Icon from '../Icon';

const VideoCard = ({data}) => {
    const { link, link_target, image } = data;
    
    return (
        <div className="event-card">
            <a href={link} target={link_target === 'BLANK' ? '_blank' : ''}>
                <div className="card-image" style={{backgroundImage: `url(${image})`}}>
                    <div className="overlay">
                        <div className="play-button">
                            <Icon name="play"/>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default VideoCard;