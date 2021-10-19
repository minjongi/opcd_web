import React from 'react';

import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import PerfectScrollBar from 'react-perfect-scrollbar';

import { highlightText } from './highlight';
import { LibCard } from '../../components/cards';



const LibrarySection = ({title, data, search}) => {
    const history = useHistory();
    if(!data || !data.length) return null;

    const handleClicked = () => {
        history.push('/vinyl_library');
    }

    return (
        <div className="section">
            {title && <h4 className="font-weight-bold text-ttnorm-bd">{title}</h4>}
            <div className="d-none d-lg-block">
                <Row>
                    {data.map((d, index) => 
                        <Col key={index} xs={2} className="py-3">
                            <LibCard data={{
                                ...d,
                                description: highlightText(d.description, search)
                            }} onClick={handleClicked}/>
                        </Col>
                    )}
                </Row>
            </div>
            <div className="d-lg-none">
                <PerfectScrollBar>
                    <Row className="flex-nowrap space-10">
                        {data.map((d, index) => 
                            <Col key={index} className="py-3 absolute-w-140">
                                <LibCard data={{
                                    ...d,
                                    description: highlightText(d.description, search)
                                }} onClick={handleClicked}/>
                            </Col>
                        )}
                    </Row>
                </PerfectScrollBar>
            </div>
        </div>
    )
};

export default LibrarySection;