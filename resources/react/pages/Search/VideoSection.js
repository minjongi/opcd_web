import React from 'react';

import { Row, Col } from 'react-bootstrap';
import PerfectScrollBar from 'react-perfect-scrollbar';

import { highlightText } from './highlight';
import { VideoCard } from '../../components/cards';

const VideoSection = ({title, data, search}) => {

    if(!data || !data.length) return null;

    return (
        <div className="section">
            {title && <h4 className="font-weight-bold text-ttnorm-bd">{title}</h4>}
            <div className="d-none d-lg-block">
                <Row className="space-10">
                    {data.map((video, index) => 
                        <Col key={index} xs={6} className="col mb-50p">
                            <VideoCard
                                data={{
                                    ...video,
                                    title: highlightText(video.title, search),
                                    desc: highlightText(video.desc, search)
                                }}/>
                        </Col>
                    )}
                </Row>
            </div>
            <div className="d-lg-none">
                <PerfectScrollBar>
                    <Row className="flex-nowrap space-10">
                        {data.map((video, index) => 
                            <Col key={index} className="pb-3 absolute-w-300">
                                <VideoCard
                                    data={{
                                        ...video,
                                        title: highlightText(video.title, search),
                                        desc: highlightText(video.desc, search)
                                    }}/>
                            </Col>
                        )}
                    </Row>
                </PerfectScrollBar>
            </div>
        </div>
    )
};

export default VideoSection;