import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { TextInput, Button } from '../../components/form';
import { validEmail } from '../../helpers/utils';
import { setAccessToken } from '../../helpers/authority';

import { updateUser } from '../../store/actions';
import { PostAdminLogin } from '../../store/auth/api';

const AdminLogin = () => {
    const history = useHistory();
    // const user = useSelector((state) => state.userState);
    const dispatch = useDispatch();
    const [data, setData] = useState({email: '', password: ''});
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setData({...data, [id]: value});
    }

    const handleSubmit = () => {
        if(submitting || !validateForm()) return;
        setSubmitting(true);

        PostAdminLogin(data).then(res => {
            setSubmitting(false);
            setAccessToken(res.data.token);
            dispatch(updateUser({...res.data.user}), );
            history.push('/admin');
        }).catch(err => {
            setSubmitting(false);
            
            if(err.response && err.response.data.errors){
                let _errors = err.response.data.errors;
                if(_errors.email) _errors.email = '이메일을 다시 입력 해주세요';
                if(_errors.password) _errors.password = '비밀번호를 다시 입력 해주세요';
                setErrors(_errors);
            }else{
                setErrors({
                    email: '이메일을 다시 입력 해주세요',
                    password: '비밀번호를 다시 입력 해주세요'
                })
            }
        });
    }

    const validateForm = () => {
        let _errors = {};
        if(!data.email) _errors = {..._errors, 'email': '이메일을 입력 하세요'};
        else if(!validEmail(data.email)) _errors = {..._errors, 'email': '이메일을 다시 입력 해주세요'};

        if(!data.password) _errors = {..._errors, 'password': '비밀번호를 입력 하세요'}
        else if(data.password.length < 6) _errors = {..._errors, 'password': '비밀번호를 다시 입력 해주세요'}
        
        if(Object.keys(_errors).length){
            setErrors(_errors);
            return false;
        }

        return true;
    }

    return (
        <div className="account-page">
            <div className="account-page__container shadow">
                <div className="text-center mb-5">
                    <img src="/logo_black.png" width="120" />
                    <h3 className="mt-4">관리자 로그인</h3>
                </div>

                <form>
                    <label>이메일 주소*</label>
                    <TextInput
                        id="email"
                        name="email"
                        type="text"
                        className="light"
                        placeholder="이메일 주소 입력"
                        value={data.email}
                        error={errors.email}
                        onChange={handleChangeField}
                    />

                    <label>비밀번호*</label>
                    <TextInput
                        id="password"
                        name="password"
                        type="password"
                        className="light"
                        placeholder="비밀번호 입력"
                        value={data.password}
                        error={errors.password}
                        onChange={handleChangeField}
                    />

                    <Button className={`btn-contain light ${submitting && 'disabled'} mt-5`} label={'로그인'} onClick={() => handleSubmit()}/>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin;