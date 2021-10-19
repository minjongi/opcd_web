import React from 'react';

import { Row, Col } from 'react-bootstrap';

const ArtistGallery = ({data}) => {
    return (
        <div className="artist-gallery">
            <Row>
                {data.map((d, index) => 
                    <Col key={index}>
                        <div className="artist-item">
                            <img src={d.avatar} />
                            <div className="item-title">{d.name}</div>
                        </div>
                    </Col>
                )}
            </Row>
        </div>
    )
}

export default ArtistGallery;