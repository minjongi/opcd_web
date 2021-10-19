import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const PostAdminFaq = (id, payload) => {
    if(id){
        return axios.post(`/admin/faqs/${id}`, payload);
    }else{
        return axios.post(`/admin/faqs`, payload);
    }
}
const UpdateFaqStatus = (id, payload) => {
    return axios.post(`/admin/faq_status/${id}`, payload);
}
const GetAdminFaqs = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/faqs${params}`);
}
const DeleteAdminFaq = (id) => {
    return axios.delete(`/admin/faqs/${id}`);
}

export {
    PostAdminFaq,
    UpdateFaqStatus,
    GetAdminFaqs,
    DeleteAdminFaq,
}