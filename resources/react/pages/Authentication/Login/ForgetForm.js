import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { TextInput, Button } from "../../../components/form";
import { INVALID, REQUIRED } from '../../../constants/validation';

import { validEmail, validDateFormat } from '../../../helpers/utils';
import { ForgotEmail, ForgotPassword } from '../../../store/auth/api';

const defaultData = {
    email: '',
    name: '',
    birthday: ''
}

const ForgetForm = ({page, onChangePage}) => {
    const history = useHistory();
    const [userInfo, setUserInfo] = useState(defaultData);
    const [submitting, setSubmitting] = useState(false);

    const [errors, setErrors] = useState({});
    const [result, setResult] = useState({});

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setUserInfo({...userInfo, [id]: value});
    }

    const handleFindEmail = () => {
        if(!validateUserInfo() || submitting) return;
        setSubmitting(true);

        ForgotEmail({
            name: userInfo.name,
            birthday: userInfo.birthday
        }).then(res => {
            setSubmitting(false);
            const { email } = res.data;
            setResult({...result, email: email});
        }).catch(err => {
            setSubmitting(false);
            setResult({...result, email: 'fail'});
        })
    }

    const validateUserInfo = () => {
        let _errors = {};

        if(!userInfo.name) _errors = {..._errors, name: REQUIRED.name};
        if(!userInfo.birthday) _errors = {..._errors, birthday: REQUIRED.birthday};
        else if(!validDateFormat(userInfo.birthday)) _errors = {..._errors, birthday: INVALID.birthday};

        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    const handleFindPassword = () => {
        if(!validateEmail() || submitting) return;
        setSubmitting(true);

        ForgotPassword({
            email: userInfo.email
        }).then(res => {
            setSubmitting(false);
            setResult({...result, password: 'success'});
            toast.success('비밀번호가 이메일로 전송되였습니다.');
        }).catch(err => {
            setSubmitting(false);
            setErrors({...errors, email: INVALID.id});
        })
    }

    const validateEmail = () => {
        let _errors = {};

        if(!userInfo.email) _errors = {..._errors, email: REQUIRED.id};
        else if(!validEmail(userInfo.email)) _errors = {..._errors, email: INVALID.email}

        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    return (
        <div>
            <div className="heading">
                <h2 className="text-ttnorm-bd text-center border-b-3 my-5 py-3 font-weight-bold">아이디 / 비밀번호 찾기</h2>
            </div>

            <Row className="mx-0 mb-5">
                <Col className="px-0">
                    <Button label="ID"
                        className={`dark ${page === 'EMAIL' ? "btn-contain" : "btn-outline disabled"}`}
                        onClick={() => onChangePage('EMAIL')}
                    />
                </Col>
                <Col className="px-0">
                    <Button label="PASSWORD"
                        className={`dark ${page === 'PASSWORD' ? "btn-contain" : "btn-outline disabled"}`}
                        onClick={() => onChangePage('PASSWORD')}
                    />
                </Col>
            </Row>

            {page === 'EMAIL' ?
                <form className="forget-email">
                    {!result.email &&
                        <>
                            <label className="font-14">이름<span className="color-purple">*</span></label>
                            <TextInput
                                id="name"
                                name="name"
                                type="text"
                                className="white"
                                value={userInfo.name}
                                onChange={handleChangeField}
                            />
                            {errors.name && <div className="error-message mb-1 mt--8">{errors.name}</div>}

                            <label className="mt-2 font-14">생년월일(YYYY/MM/DD)<span className="color-purple">*</span></label>
                            <TextInput
                                id="birthday"
                                name="birthday"
                                type="text"
                                className="white"
                                value={userInfo.birthday}
                                onChange={handleChangeField}
                            />
                            {errors.birthday && <div className="error-message mb-1 mt--8">{errors.birthday}</div>}

                            <Button className="mt-5 font-16 btn-contain" label="아이디 찾기" onClick={handleFindEmail}/>
                        </>
                    }

                    {result.email && result.email === 'fail' &&
                        <div className="text-center">
                            <div>일치하는 회원정보가 없습니다.</div>
                            <div>회원가입을 하시겠어요?</div>
                            <Button className="mt-5 font-16 btn-contain" label="SIGN UP" onClick={() => history.push('/register')}/>
                        </div>
                    }

                    {result.email && validEmail(result.email) &&
                        <div className="text-center">
                            <div className="mb-4">입력하신 정보와 일치하는 아이디를 알려 드립니다.</div>
                            <h3>{result.email}</h3>
                            <Button className="mt-5 font-16 btn-color-purple" label="로그인으로 이동" onClick={() => onChangePage('LOGIN')}/>
                        </div>
                    }

                </form>
                :
                <form className="forget-password">
                    <label className="font-14">아이디(이메일주소)<span className="color-purple">*</span></label>
                    <TextInput
                        id="email"
                        name="email"
                        type="text"
                        className="white"
                        value={userInfo.email}
                        onChange={handleChangeField}
                        onKeyDown={(e) => {
                            if(e.keyCode === 13) {
                                e.preventDefault();
                                handleFindPassword();
                            }
                        }}
                    />
                    {errors.email && <div className="error-message mb-1 mt--8">{errors.email}</div>}

                    <Button className="mt-5 font-16 btn-contain" label={'임시 비밀번호 발송'} onClick={() => handleFindPassword()}/>
                </form>
            }
            
            <div className="font-14 m-auto text-center" style={{maxWidth: 410}}>
                <div className="mt-4">{''}</div>
                <span>본인의 회원정보를 찾을수 없는 경우{' '}</span>
                <span className="text-nowrap"><a href="tel:02-994-7525" className="text-white text-decoration-underline">안내전화 02-994-7525</a>으로</span>
                <span>{' '}문의 하시기 바랍니다.</span>
            </div>
        </div>
    )
}

export default ForgetForm;




