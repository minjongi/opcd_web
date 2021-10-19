import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const UpdateMemberStatus = (id, payload) => {
    return axios.post(`/admin/opmember_status/${id}`, payload);
}
const PostMember = (id, payload) => {
    return axios.post(`/admin/opmembers/${id}`, payload);
}
const GetMembers = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/opmembers${params}`);
}
const GetMember = (id) => {
    return axios.get(`/admin/opmembers/${id}`);
}
const DeleteMember = (id) => {
    return axios.delete(`/admin/opmembers/${id}`);
}


export {
    UpdateMemberStatus,
    GetMembers,
    PostMember,
    GetMember,
    DeleteMember,
}