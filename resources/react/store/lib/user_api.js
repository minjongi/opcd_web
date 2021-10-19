import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const GetCategorNames = () => {
    return axios.get(`/api/category_names`);
}

const GetContents = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/api/vinylcontents${params}`);
}

const GetContent = (id) => {
    return axios.get(`/api/vinylcontent/${id}`);
}

export {
    GetCategorNames,
    GetContents,
    GetContent
}