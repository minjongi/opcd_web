import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { setAccessToken } from '../../../helpers/authority';
import { updateUser } from '../../../store/actions';

import { VerifyUser } from '../../../store/auth/social_api';

const LoginSuccess = () => {
    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if(params.code){
            checkLoggedinUser(params.code);
        }else{
            history.push('/main');
        }
    }, [params.code]);

    const checkLoggedinUser = (code) => {
        VerifyUser(code).then(res => {
            const { user, access_token } = res.data;
            setAccessToken(access_token);
            dispatch(updateUser(user));
            history.push('/main');
        }).catch(err => {
            history.push('/main');
        });
    }

    return null;
}

export default LoginSuccess;