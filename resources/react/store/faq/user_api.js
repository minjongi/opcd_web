import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const GetFaqs = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/api/faqs${params}`);
}

export {
    GetFaqs
}