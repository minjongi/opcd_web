import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const PostContent = (id, payload) => {
    if(id){
        return axios.post(`/admin/wmmcontents/${id}`, payload);
    }else{
        return axios.post(`/admin/wmmcontents`, payload);
    }
}
const UpdateContentStatus = (id, payload) => {
    return axios.post(`/admin/wmmcontent_status/${id}`, payload);
}
const GetContents = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/wmmcontents${params}`);
}
const DeleteContent = (id) => {
    return axios.delete(`/admin/wmmcontents/${id}`);
}

const PostLayer = (id, payload) => {
    if(id){
        return axios.post(`/admin/wmmlayers/${id}`, payload);
    }else{
        return axios.post(`/admin/wmmlayers`, payload);
    }
}
const GetLayers = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/wmmlayers${params}`);
}
const GetLayer = (id) => {
    return axios.get(`/admin/wmmlayers/${id}`);
}
const DeleteLayer = (id) => {
    return axios.delete(`/admin/wmmlayers/${id}`);
}
const GetLayerNameList = () => {
    return axios.get('/admin/wmmlayer_names');
}


const PostPuzzleBanner = (id, payload) => {
    return axios.post(`/admin/puzzlebanners/${id}`, payload);
}
const GetPuzzleBanners = () => {
    return axios.get(`/admin/puzzlebanners`);
}
const DeletePuzzleBanners = (id) => {
    return axios.delete(`/admin/puzzlebanners/${id}`);
}

export {
    PostContent,
    UpdateContentStatus,
    GetContents,
    DeleteContent,

    PostLayer,
    GetLayers,
    GetLayer,
    DeleteLayer,
    GetLayerNameList,

    PostPuzzleBanner,
    GetPuzzleBanners,
    DeletePuzzleBanners
}