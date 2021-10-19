import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import RegisterUserTab from './RegisterUserTab';
import RegisterArtistTab from './RegisterArtistTab';
import RegisterComplete from './RegisterComplete';

import { setAccessToken } from '../../../helpers/authority';
import { updateUser } from '../../../store/actions';

import { PostUserRegister } from '../../../store/auth/api';

const Register = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [tab, setTab] = useState(1);
    const [userInfo, setUserInfo] = useState({});
    const [submitting, setSubmitting] = useState(false);
    
    const handleSubmit = (data) => {
        if(tab === 1) {
            setTab(2);
            setUserInfo({...userInfo, ...data});
        }else if(tab == 2) {
            let _data = {...userInfo, ...data};
            setUserInfo(_data);

            register(_data);
        }
    }

    const register = (data) => {
        if(submitting) return;
        setSubmitting(true);

        PostUserRegister(data).then(res => {
            setSubmitting(false);
            const { user, access_token } = res.data;
            setAccessToken(access_token);
            dispatch(updateUser(user));

            setTab(3);
        }).catch(err => {
            setSubmitting(false);
        });
    }

    const handleRedirect = (path) => {
        history.push(path === 'profile' ? '/my_page' : '/main');
    }

    return (
        <div className="register-page-content">
            <div className="section-container">
                <div className="max-w-500 m-auto">
                    <div className="heading border-b-3 my-5 pb-4 text-center font-weight-bold">
                        <h2 className="text-ttnorm-bd py-2 font-weight-bold">{tab === 3 ? 'Completed' : 'Sign Up'}</h2>
                        {tab < 3 && 
                            <div className="color-200">
                                <span className="text-ttnorm-bd">OPCD</span>
                                <span>에 오신 것을 환영합니다.</span>
                            </div>
                        }
                    </div>

                    <form className="register-form font-14" onSubmit={handleSubmit}>
                        {tab === 1 && <RegisterUserTab onSubmit={handleSubmit}/> }
                        {tab === 2 && <RegisterArtistTab onSubmit={handleSubmit}/> }
                        {tab === 3 && <RegisterComplete userInfo={userInfo} onSubmit={handleRedirect}/> }
                    </form>
                </div>
            </div>
        </div>   
    )
}

export default Register;
