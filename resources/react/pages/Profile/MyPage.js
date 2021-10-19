import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import PersonalPage from './TabContent/PersonalPage';
import ProposalPage from './TabContent/ProposalPage';
import ProposalDetail from './TabContent/ProposalDetail';

import { Button } from '../../components/form';

const MyPage = () => {
    const userState = useSelector((state) => state.userState);
    const history = useHistory();
    const [tab, setTab] = useState(1);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if(!userState || !userState.id || userState.role !== 'USER'){
            history.push('/main');
        }
    }, [userState]);

    const handleChangeTab = (tabId) => {
        setTab(tabId);
    }

    return (
        <div className="login-page-content">
            <div className="section-container">
                <div  className="max-w-500 m-auto">
                    {selected ? 
                        <ProposalDetail userState={userState} applicant={selected} onCancel={() => setSelected(null)}/>
                        :
                        <>
                            <div className="heading">
                                <h2 className="text-ttnorm-bd text-center border-b-3 my-5 pt-3 pb-4 font-weight-bold">My Page</h2>
                            </div>

                            <Row className="mx-0 mb-5">
                                <Col className="px-0">
                                    <Button label="개인정보 수정"
                                        className={`dark ${tab === 1 ? "btn-contain" : "btn-outline disabled"}`}
                                        onClick={() => handleChangeTab(1)}
                                    />
                                </Col>
                                <Col className="px-0">
                                    <Button label="내 시청서 관리"
                                        className={`dark ${tab === 2 ? "btn-contain" : "btn-outline disabled"}`}
                                        onClick={() => handleChangeTab(2)}
                                    />
                                </Col>
                            </Row>

                            <div>
                                {tab === 1 && <PersonalPage />}
                                {tab === 2 && <ProposalPage onSelect={(item) => setSelected(item)}/>}
                            </div>
                        </>
                    }
                    
                </div>
            </div>
        </div>   
    )
}

export default MyPage;




