import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const PostAdminNotice = (id, payload) => {
    if(id){
        return axios.post(`/admin/notices/${id}`, payload);
    }else{
        return axios.post(`/admin/notices`, payload);
    }
}
const UpdateNoticeStatus = (id, payload) => {
    return axios.post(`/admin/notice_status/${id}`, payload);
}
const GetAdminNotices = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/notices${params}`);
}
const DeleteAdminNotice = (id) => {
    return axios.delete(`/admin/notices/${id}`);
}

export {
    PostAdminNotice,
    UpdateNoticeStatus,
    GetAdminNotices,
    DeleteAdminNotice,
}