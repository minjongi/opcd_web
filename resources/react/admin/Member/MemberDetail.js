import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Avatar, CircleFullSpinner } from '../../components';
import { Button, CheckBox } from '../../components/form';

import { GetMember } from '../../store/member/api';

const MemberDetail = () => {
    const history = useHistory();
    const params = useParams();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if(params && params.id){
            GetMember(params.id).then(res => {
                const { data } = res.data;

                setUserInfo(data);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [params])

    if(!userInfo) return null;

    return (
        <div className="pb-4">
            <h4 className="mb-5">회원상세정보</h4>

            <div className="max-w-500 m-auto">
                <div className="d-flex flex-column align-items-center mb-4">
                    <Avatar url={userInfo.avatar || ''} />
                </div>

                <Row>
                    <Col xs={12} md={6}><p>이름 : {userInfo.name || ''}</p></Col>
                    <Col xs={12} md={6}><p>생년월일 : {userInfo.birthday || ''}</p></Col>
                    <Col xs={12} md={6}><p>휴대폰 번호 : {userInfo.phone || ''}</p></Col>
                    <Col xs={12} md={6}><p>이메일주소 : {userInfo.email || ''}</p></Col>
                    <Col xs={12}>
                        <p>주소 : {userInfo.address || ''} {userInfo.address_detail || ''}</p>
                    </Col>
                </Row>

                <label className="border-b mt-5 w-100 mb-4">아티스트 옵션 정보</label>

                <p>아티스트명 : {userInfo.artist_name || ''}</p>
                <p>포지션 : {userInfo.position || ''}</p>

                <label className="mt-2">활동중인 <span>SNS</span>정보입력</label>
                {userInfo.social_1 && <p>{userInfo.social_1}</p>}
                {userInfo.social_2 && <p>{userInfo.social_2}</p>}
                {userInfo.social_3 && <p>{userInfo.social_3}</p>}
                {userInfo.social_4 && <p>{userInfo.social_4}</p>}

                <label className="border-b mt-5 w-100 mb-4">마케팅 정보 수신 및 활용 동의</label>
                <div className="d-flex flex-wrap">
                    <CheckBox
                        id="market_message"
                        name="market_message"
                        label="문자메세지"
                        className="mr-4 color-400"
                        defaultChecked={userInfo.market_message}
                    />
                    <CheckBox
                        id="market_mail"
                        name="market_mail"
                        label="이메일"
                        className="mr-4 color-400"
                        defaultChecked={userInfo.market_mail}
                    />
                </div>
            </div>

            <div className="d-flex px-1 justify-content-center mt-5">
                <Button label="돌아가기" className="light px-5 mx-2" onClick={() => history.push('/admin/members')}/>
            </div>
        </div>
    )
};

export default MemberDetail;