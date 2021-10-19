import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Button } from '../../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import BBProgramEdit from './BBProgramEdit';
import BBProgramSubmit from './BBProgramSubmit';
import BBProgramView from './BBProgramView';

import { GetCampains, PostPropose } from '../../../store/camp/user_api';
import { CircleFullSpinner } from '../../../components';

const BeatboxProgram = () => {
    const userState = useSelector((state) => state.userState);
    const type = "BEATBOX";
    const [tab, setTab] = useState(0);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const [campaigns, setCampains] = useState([]);

    useEffect(() => {
        GetCampains({type}).then(res => {
            const { campaigns } = res.data;
            setCampains(campaigns);
        });
    }, [tab]);

    

    const handleRequest = (type, data) => {
        switch(type){
            case 'PROPOSE':
                if(userState && userState.role === 'USER') {
                    setStep(2);
                }else{
                    setMessage('로그인 후 신청 가능합니다.');
                }
                break;
            case 'VIEW':
                setStep(3);
                break;
            case 'SUBMIT':
                handleSubmitPropose(data);
                break;
            case 'CANCEL':
                setStep(1);
                break;
            case 'RETURN':
                setStep(1);
                break;
            default:
                break;
        }
    }

    const handleSubmitPropose = (data) => {
        if(submitting) return;
        setSubmitting(true);

        PostPropose(data).then(res => {
            setSubmitting(false);
            setStep(3);
            toast.success("당신의 신청은 제출되였습니다.");
        }).catch(err => {
            setSubmitting(false);
        })
    }

    return (
        <div id="page-songcamp" className="pt-5">
            {submitting && <CircleFullSpinner size="full"/>}
            <div className="section-container">
                <div className="songcamp-container">
                    <h2 className="text-center font-weight-bold text-ttnorm-bd mb-4">BEATBOX</h2>
                    <div className="songcamp-banner">
                        <img src="/images/banner_03.jpg" />
                    </div>
                    
                    {campaigns && !!campaigns.length && 
                        <>
                            <Row className="mx-0 mb-4">
                                {campaigns && campaigns.map((cam, index) => 
                                    <Col key={index} className="px-0">
                                        <Button label={cam.name}
                                            className={`dark ${tab === index ? "btn-contain" : "btn-outline disabled"}`}
                                            onClick={() => setTab(index)}
                                        />
                                    </Col>
                                )}
                            </Row>

                            {step === 1 && <BBProgramEdit campaign={campaigns[tab]} onSubmit={handleRequest}/>}
                            {step === 2 && <BBProgramSubmit tab={tab} userInfo={userState} campaign={campaigns[tab]} onSubmit={handleRequest}/>}
                            {step === 3 && <BBProgramView tab={tab} userInfo={userState} campaign={campaigns[tab]} onSubmit={handleRequest}/>}
                        </>
                    }
                    
                </div>
            </div>

            {message && 
                <SweetAlert
                    info
                    title=""
                    confirmBtnText="확인"
                    confirmBtnBsStyle="info"
                    onConfirm={() => setMessage(null)}
                    customClass="text-info"
                    // style={{top: window && window.scrollY ? window.scrollY /2 : 0}}
                >
                    {message}
                </SweetAlert>
            }
        </div>
    )
}

export default BeatboxProgram;
