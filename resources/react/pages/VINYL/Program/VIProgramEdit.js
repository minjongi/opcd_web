import React, { useState } from 'react';

import { Row, Col } from 'react-bootstrap';
import { Button } from '../../../components/form';

const VIProgramEdit = ({campaign, onSubmit}) => {

    if(!campaign) return null;

    const handleSubmit = () => {
        onSubmit('PROPOSE');
    }

    return (
        <div>
            <Row className="mb-3">
                <Col sm={8} className="mb-2">
                    <Button label="신청하기"
                        className="btn-color-purple flex-grow-2"
                        onClick={handleSubmit}
                    />
                </Col>
                <Col sm={4} className="mb-2">
                    <Button label="신청자 현황보기"
                        className="btn-color-gray flex-grow-1"
                        onClick={() => onSubmit('VIEW')}
                    />
                </Col>
            </Row>
            
            <div className="py-3 px-2 bg-gray-800">
                <div className="html-content" dangerouslySetInnerHTML={{__html: campaign.description || ''}}/>
            </div>

            <Row className="mt-4">
                <Col sm={8} className="mb-2">
                    <Button label="신청하기"
                        className="btn-color-purple flex-grow-2"
                        onClick={handleSubmit}
                    />
                </Col>
                <Col sm={4} className="mb-2">
                    <Button label="신청자 현황보기"
                        className="btn-color-gray flex-grow-1"
                        onClick={() => onSubmit('VIEW')}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default VIProgramEdit;