import React from 'react';

import { Row, Col } from 'react-bootstrap';
import PerfectScrollBar from 'react-perfect-scrollbar';

import { highlightText } from './highlight';
import { EventCard } from '../../components/cards';

const EventSection = ({title, data, search}) => {

    if(!data || !data.length) return null;

    return (
        <div className="section">
            {title && <h4 className="font-weight-bold text-ttnorm-bd">{title}</h4>}
            <div className="d-none d-md-block">
                <Row className="space-10">
                    {data.map((event, index) => 
                        <Col key={index} xs={4} className="col mb-50p">
                            <EventCard
                                data={{
                                    ...event,
                                    title: highlightText(event.title, search),
                                    desc: highlightText(event.desc, search)
                                }}/>
                        </Col>
                    )}
                </Row>
            </div>
            <div className="d-md-none">
                <PerfectScrollBar>
                    <Row className="flex-nowrap space-10">
                        {data.map((event, index) => 
                            <Col key={index} className="pb-3 absolute-w-300">
                                <EventCard
                                    data={{
                                        ...event,
                                        title: highlightText(event.title, search),
                                        desc: highlightText(event.desc, search)
                                    }}/>
                            </Col>
                        )}
                    </Row>
                </PerfectScrollBar>
            </div>
        </div>
    )
};

export default EventSection;