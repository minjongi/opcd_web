import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';

import { GetPolicies } from '../../store/policy/user_api';

const PolicyPage = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('USE_POLICY');
    const [policies, setPolicies] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        if(location.search){
            if(location.search.indexOf('use') > -1) setTab('USE_POLICY');
            else if(location.search.indexOf('personal') > -1) setTab('PERSONAL_POLICY');
        }

        GetPolicies().then(res => {
            setLoading(false);
            const { policies } = res.data;
            setPolicies(policies);
            handleUpdateContent(policies);
        });
    }, [location.search]);

    useEffect(() => {
        handleUpdateContent(policies);
    }, [tab]);

    const handleUpdateContent = (data) => {
        const _policy = data.find(p => p.type === tab);
        if(_policy) setContent(_policy.content);
        else setContent('');
    }

    return (
        <div id="page-terms" className="mt-5">
            <div className="section-container">
                {loading && <CircleFullSpinner size="full"/>}
                <div className="max-w-768 m-auto">
                    <h2 className="text-center text-kr-bd mb-4">서비스약관</h2>
                    
                    <Row className="mx-0 mb-4">
                        <Col className="px-0">
                            <Button label="이용약관"
                                className={`dark ${tab === 'USE_POLICY' ? "btn-contain" : "btn-outline disabled"}`}
                                onClick={() => setTab('USE_POLICY')}
                            />
                        </Col>
                        <Col className="px-0">
                            <Button label="개인정보취급방침"
                                className={`dark ${tab === 'PERSONAL_POLICY' ? "btn-contain" : "btn-outline disabled"}`}
                                onClick={() => setTab('PERSONAL_POLICY')}
                            />
                        </Col>
                    </Row>

                    <div>
                        <div className="html-content" dangerouslySetInnerHTML={{__html: content}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PolicyPage;