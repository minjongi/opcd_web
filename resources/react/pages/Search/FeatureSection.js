import React from 'react';

import { Row, Col } from 'react-bootstrap';
import PerfectScrollBar from 'react-perfect-scrollbar';

import { highlightText } from './highlight';
import { FeatureCard } from '../../components/cards';
import { FeatureGallery } from '../../components';

const FeatureSection = ({title, data, search}) => {
    if(!data || !data.length) return null;

    const highlightedData = () => {
        if(!search) return data;

        const _data = data.map(d => {
            const { tag, ...rest } = d;
            const _tagList = tag.map(t => {
                return {
                    ...t,
                    tag: highlightText(t.tag, search)
                }
            });

            return {
                ...d,
                title: highlightText(d.title, search),
                tag: _tagList
            }
        });

        return _data;
    }

    return (
        <div className="section">
            {title && <h4 className="font-weight-bold text-ttnorm-bd">{title}</h4>}
            <div className="d-none d-lg-block">
                {/* <FeatureGallery data={highlightedData()} fullView/> */}
                <Row className="space-10">
                    {highlightedData().map((d, index) => 
                        <Col key={index} xs={4} className="col mb-50p">
                            <FeatureCard data={d}/>
                        </Col>
                    )}
                </Row>
            </div>
            <div className="d-lg-none">
                <PerfectScrollBar>
                    <Row className="flex-nowrap space-10">
                        {highlightedData().map((d, index) => 
                            <Col key={index} className="pb-3 absolute-w-300">
                                <FeatureCard data={d}/>
                            </Col>
                        )}
                    </Row>
                </PerfectScrollBar>
            </div>
        </div>
    )
};

export default FeatureSection;