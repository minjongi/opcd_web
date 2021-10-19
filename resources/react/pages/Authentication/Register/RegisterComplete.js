import React from 'react';

import { Row, Col } from 'react-bootstrap';
import { Avatar } from '../../../components';
import { Button } from '../../../components/form';

const RegisterComplete = ({ userInfo, onSubmit }) => {
    return (
        <>
            <div className="text-center">
                <img className="w-4-rem mb-3" src="/images/icons/register_check.png" />
                <h6>OPCD 회원가입이 완료되였습니다.</h6>
                <p className="font-12 my-2">프로필 추가 정보를 입력하고 나를 알려 보는 건 어떨까요?</p>
            </div>

            <div className="d-flex flex-column align-items-center mt-4">
                <Avatar placeholder="img"/>
                <div className="font-weight-bold mt-1">{userInfo.artist_name || ''}</div>
                <div className="font-12">({userInfo.name})</div>
            </div>
            
            <Row className="my-5">
                <Col>
                    <Button label="메인으로 이동"  className="font-16" onClick={() => onSubmit('main')}/>
                </Col>
                <Col>
                    <Button label="프로필 수정" className="font-16 btn-color-purple" onClick={() => onSubmit('profile')}/>
                </Col>
            </Row>
        </>
    )
}

export default RegisterComplete;