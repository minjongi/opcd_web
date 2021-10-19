import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const GetNotices = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/api/notices${params}`);
}

const GetNotice = (id) => {
    return axios.get(`/api/notice/${id}`);
}

const GetRecentNotices = () => {
    return axios.get('/api/recent_notices');
}

export {
    GetNotices,
    GetNotice,
    GetRecentNotices
}