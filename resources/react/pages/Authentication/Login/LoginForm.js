import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { TextInput, Button } from "../../../components/form";
import { INVALID, REQUIRED } from '../../../constants/validation';

import { setAccessToken } from '../../../helpers/authority';
import { validEmail } from '../../../helpers/utils';
import { updateUser } from '../../../store/actions';

import { PostUserLogin } from '../../../store/auth/api';
import { SocialLogin } from '../../../store/auth/social_api';

const LoginForm = ({onChangePage}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState({email: '', password: ''});
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setUserInfo({...userInfo, [id]: value});
    }

    const handleSubmit = () => {
        if(!validateField() || submitting) return;
        setSubmitting(true);

        PostUserLogin(userInfo).then(res => {
            setSubmitting(false);
            const { user, access_token } = res.data;
            setAccessToken(access_token);
            dispatch(updateUser(user));
            history.push('/main');
        }).catch(err => {
            setSubmitting(false);
            if(err.response
                && err.response.data.type
                && err.response.data.type === 'email'){
                setErrors({...errors, email: INVALID.id});
            }else setErrors({...errors, password: INVALID.password});
        });
    }

    const validateField = () => {
        let _errors = {};

        if(!userInfo.email) _errors = {..._errors, email: REQUIRED.id};
        else if(!validEmail(userInfo.email)) _errors = {..._errors, email: INVALID.email}

        if(!userInfo.password) _errors = {..._errors, password: REQUIRED.password};
        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    return (
        <div>
            <div className="heading">
                <h2 className="text-ttnorm-bd text-center border-b-3 my-5 py-3 font-weight-bold">LOGIN</h2>
            </div>
            <form className="login-form">
                <label className="font-14">아이디(이메일주소)<span className="color-purple">*</span></label>
                <TextInput
                    id="email"
                    name="email"
                    type="text"
                    className="white"
                    value={userInfo.email}
                    onChange={handleChangeField}
                />
                {errors.email && <div className="error-message mb-1 mt--8">{errors.email}</div>}

                <label className="mt-2 font-14">비밀번호<span className="color-purple">*</span></label>
                <TextInput
                    id="password"
                    name="password"
                    type="password"
                    className="white"
                    value={userInfo.password}
                    onChange={handleChangeField}
                />
                {errors.password && <div className="error-message mb-1 mt--8">{errors.password}</div>}

                <Button className="mt-5 font-16 btn-contain" label={'LOGIN'} onClick={() => handleSubmit()}/>
            </form>

            <div className="font-14 d-flex justify-content-between">
                <div className="op-navs mt-4 mr-2">
                    <span className="op-nav-item" onClick={() => onChangePage('EMAIL')}>아이디 찾기</span>
                    <span className="mx-1">ㅣ</span>
                    <span className="op-nav-item" onClick={() => onChangePage('PASSWORD')}>비밀번호 찾기</span>
                </div>
                <div className="op-navs mt-4">
                    <Link to="/register" className="op-nav-item">회원가입</Link>
                </div>
            </div>

            {/*<div className="my-5 border-b">{' '}</div>*/}

            {/*<div className="text-center">*/}
            {/*    <div className="font-22 mb-4">OR LOGIN WITH</div>*/}
            {/*    <div>*/}
            {/*        <a href={`${process.env.MIX_API_URL}/login/google`} className="text-decoration-none">*/}
            {/*            <Button*/}
            {/*                className="mb-2 font-16 btn-contain"*/}
            {/*                label={(*/}
            {/*                    <div className="op-social-btn">*/}
            {/*                        <img src="/images/icons/google.png"/>*/}
            {/*                        <span>Google로 로그인</span>*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*            />*/}
            {/*        </a>*/}
            {/*        */}
            {/*        <a href={`${process.env.MIX_API_URL}/login/naver`} className="text-decoration-none">*/}
            {/*            <Button*/}
            {/*                className="mb-2 font-16 btn-contain"*/}
            {/*                label={(*/}
            {/*                    <div className="op-social-btn">*/}
            {/*                        <img src="/images/icons/naver.png"/>*/}
            {/*                        <span>네이버로 로그인</span>*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*            />*/}
            {/*        </a>*/}
            {/*        */}
            {/*        <a href={`${process.env.MIX_API_URL}/login/kakao`} className="text-decoration-none">*/}
            {/*            <Button*/}
            {/*                className="mb-2 font-16 btn-contain"*/}
            {/*                label={(*/}
            {/*                    <div className="op-social-btn">*/}
            {/*                        <img src="/images/icons/kakaotalk.png"/>*/}
            {/*                        <span>카카오로 로그인</span>*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*            />*/}
            {/*        </a>*/}
            {/*        */}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}

export default LoginForm;




