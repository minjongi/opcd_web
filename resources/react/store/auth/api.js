import axios from 'axios';
import { getUserRole } from '../../helpers/authority';

const PostAdminLogin = (payload) => {
    return axios.post(`/admin/login`, payload);
}

const PostUserLogin = (payload) => {
    return axios.post(`/api/login`, payload);
}
const PostUserRegister = (payload) => {
    return axios.post(`/api/register`, payload);
}
const CheckRegisterInfo = (payload) => {
    return axios.post('/api/check_register', payload);
}
const PostUserProfile = (payload) => {
    return axios.post(`/api/profile`, payload);
}
const GetUserProfile = () => {
    return axios.get(`/api/profile`);
}
const GetArtistProfile = (id) => {
    return axios.get(`/api/artist_profile/${id}`);
}
const DeleteAccount = () => {
    return axios.delete(`/api/delete_account`);
}


const CheckUser = () => {
    const role = getUserRole();
    
    if(role === 'ADMIN'){
        return axios.get(`/admin/check_token`);
    }else{
        return axios.get(`/api/check_token`);
    }
}

const ForgotEmail = (payload) => {
    return axios.post('/api/forgot_email', payload);
}

const ForgotPassword = (payload) => {
    return axios.post('/api/forgot_password', payload);
}

export {
    PostAdminLogin,

    PostUserLogin,
    PostUserRegister,
    CheckRegisterInfo,
    DeleteAccount,

    PostUserProfile,
    GetUserProfile,
    GetArtistProfile,

    CheckUser,

    ForgotEmail,
    ForgotPassword
}