import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { Button } from '../../components/form';

import { getNoticeType } from '../../helpers/utils';
import { GetNotice } from '../../store/notice/user_api';

const NoticePage = () => {
    const params = useParams();
    const history = useHistory();
    const [data, setData] = useState(null);

    useEffect(() => {
        if(params.id){
            GetNotice(params.id).then(res => {
                const { notice } = res.data;
                setData(notice);
            }).catch(err => {
                console.log(err);
            });
        }
    }, [params.id]);

    console.log(data);
    if(!data) return null;

    return (
        <div className="faq-page">
            <div className="section-container">
                <div className="max-w-768 m-auto">
                    <div className="heading text-center my-5 border-b-3">
                        <h2 className="text-ttnorm-bd py-3 font-weight-bold">NOTICE</h2>
                        <p className="color-400">공지사항입니다</p>
                    </div>

                    <div>
                        <div className="d-flex align-items-center border-y">
                            <div className="p-12" style={{width: 100}}>
                                <span className={`op-badge ${data.type === 'NOTICE' ? 'purple' : ''}`}>{getNoticeType(data.type)}</span>
                            </div>
                            <div className="p-12 flex-grow-1">{data.title}</div>
                            <div className="p-12" style={{width: 124}}>{data.created_at.slice(0, 10)}</div>
                        </div>
                        <div className="p-12 border-b html-content" dangerouslySetInnerHTML={{__html: data.content || ''}}></div>
                        <Row className="mx-0 my-5 d-flex justify-content-center">
                            <Col sm={6} className="pl-0 pr-2">
                                <Button label="목록" className="btn-color-gray flex-grow-1" onClick={() => history.push('/notices')}/>
                            </Col>
                        </Row>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default NoticePage;