import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const PostCategory = (id, payload) => {
    if(id){
        return axios.post(`/admin/categories/${id}`, payload);
    }else{
        return axios.post(`/admin/categories`, payload);
    }
}
const UpdateCategoryStatus = (id, payload) => {
    return axios.post(`/admin/category_status/${id}`, payload);
}
const GetCategories = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/categories${params}`);
}
const DeleteCategory = (id) => {
    return axios.delete(`/admin/categories/${id}`)
}
const GetCategorNames = () => {
    return axios.get(`/admin/category_names`);
}


const PostContent = (id, payload) => {
    if(id){
        return axios.post(`/admin/vinylcontents/${id}`, payload);
    }else{
        return axios.post(`/admin/vinylcontents`, payload);
    }
}
const UpdateContentStatus = (id, payload) => {
    return axios.post(`/admin/vinylcontent_status/${id}`, payload);
}
const GetContents = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/vinylcontents${params}`);
}
const GetContent = (id) => {
    return axios.get(`/admin/vinylcontents/${id}`);
}
const DeleteContent = (id) => {
    return axios.delete(`/admin/vinylcontents/${id}`);
}

export {
    PostCategory,
    UpdateCategoryStatus,
    GetCategories,
    DeleteCategory,
    GetCategorNames,

    PostContent,
    UpdateContentStatus,
    GetContents,
    GetContent,
    DeleteContent,
}