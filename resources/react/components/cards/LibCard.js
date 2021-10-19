import React from 'react';

const LibCard = ({data, onClick}) => {
    const { description, image } = data;

    return (
        <div className="lib-card">
            <div className="card-image" style={{backgroundImage: `url(${image})`}} onClick={() => onClick && onClick()}></div>
            <div className="content-wrapper">
                {description ?
                    <p className="description two-line-truncate">{description}</p> : null
                }
            </div>
        </div>
    )
}

export default LibCard;