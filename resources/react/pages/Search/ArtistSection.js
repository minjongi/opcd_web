import React from 'react';

import { Row, Col } from 'react-bootstrap';
import PerfectScrollBar from 'react-perfect-scrollbar';

import { highlightText } from './highlight';
import { Avatar } from '../../components';

const Artist = ({data}) => {
    return (
        <div className="d-flex flex-column align-items-center">
            <Avatar url={data.avatar}/>
            <div className="mt-2">{data.artist_name}</div>
            <div className="font-14">{data.position}</div>
        </div>
    )
}

const ArtistSection = ({title, data, search}) => {
    if(!data || !data.length) return null;

    return (
        <div className="section">
            {title && <h4 className="font-weight-bold text-ttnorm-bd">{title}</h4>}
            <div className="d-none d-lg-block">
                <Row>
                    {data.map((d, index) => 
                        <Col key={index} xs={2} className="py-3">
                            <Artist
                                data={{
                                    ...d,
                                    artist_name: highlightText(d.artist_name, search),
                                    position: highlightText(d.position, search)
                                }}/>
                        </Col>
                    )}
                </Row>
            </div>
            <div className="d-lg-none">
                <PerfectScrollBar>
                    <Row className="flex-nowrap space-10">
                        {data.map((d, index) => 
                            <Col key={index} className="py-3 absolute-w-140">
                                <Artist
                                    data={{
                                        ...d,
                                        artist_name: highlightText(d.artist_name, search),
                                        position: highlightText(d.position, search)
                                    }}/>
                            </Col>
                        )}
                    </Row>
                </PerfectScrollBar>
            </div>
        </div>
    )
};

export default ArtistSection;