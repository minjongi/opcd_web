import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const PostFeatureContent = (id, payload) => {
    if(id){
        return axios.post(`/admin/features/${id}`, payload);
    }else{
        return axios.post(`/admin/features`, payload);
    }
}
const GetFeatureList = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/features${params}`);
}
const GetFeatureContent = (id) => {
    return axios.get(`/admin/features/${id}`);
}
const DeleteFeatureContent = (id) => {
    return axios.delete(`/admin/features/${id}`);
}
const UpdateFeatureStatus = (id, payload) => {
    return axios.post(`/admin/feature_status/${id}`, payload);
}


const GetFeatures = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/api/features${params}`);
}
const GetFeature = (id) => {
    return axios.get(`/api/features/${id}`);
}
const GetRelatedFeatures = (id, payload) => {
    return axios.post(`/api/related_features/${id}`, payload);
}

export {
    PostFeatureContent,
    GetFeatureList,
    GetFeatureContent,
    DeleteFeatureContent,
    UpdateFeatureStatus,

    GetFeatures,
    GetFeature,
    GetRelatedFeatures
}