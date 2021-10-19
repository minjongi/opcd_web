import axios from 'axios';

const SocialLogin = (type) => {
    return axios.get(`/login/${type}`);
}

const VerifyUser = (code) => {
    return axios.post('/api/verify_user', {code});
}

export {
    SocialLogin,
    VerifyUser
}