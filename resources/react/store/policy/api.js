import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const PostPolicy = (payload) => {
    return axios.post(`/admin/policy`, payload);
}
const GetPolicy = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/policy${params}`);
}
export {
    PostPolicy,
    GetPolicy
}