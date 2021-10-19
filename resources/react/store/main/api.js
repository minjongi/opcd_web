import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const PostBanner = (id, payload) => {
    if(id){
        return axios.post(`/admin/banners/${id}`, payload);
    }else{
        return axios.post(`/admin/banners`, payload);
    }
}
const UpdateBannerStatus = (id, payload) => {
    return axios.post(`/admin/banner_status/${id}`, payload);
}
const GetBanners = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/banners${params}`);
}
const DeleteBanner = (id) => {
    return axios.delete(`/admin/banners/${id}`);
}


const PostEvent = (id, payload) => {
    if(id){
        return axios.post(`/admin/events/${id}`, payload);
    }else{
        return axios.post(`/admin/events`, payload);
    }
}
const UpdateEventStatus = (id, payload) => {
    return axios.post(`/admin/event_status/${id}`, payload);
}
const GetEvents = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/events${params}`);
}
const DeleteEvent = (id) => {
    return axios.delete(`/admin/events/${id}`);
}


const PostVideo = (id, payload) => {
    if(id){
        return axios.post(`/admin/videos/${id}`, payload);
    }else{
        return axios.post(`/admin/videos`, payload);
    }
}
const UpdateVideoStatus = (id, payload) => {
    return axios.post(`/admin/video_status/${id}`, payload);
}
const GetVideos = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/videos${params}`);
}
const DeleteVideo = (id) => {
    return axios.delete(`/admin/videos/${id}`);
}


export {
    PostBanner,
    UpdateBannerStatus,
    GetBanners,
    DeleteBanner,

    PostEvent,
    UpdateEventStatus,
    GetEvents,
    DeleteEvent,

    PostVideo,
    UpdateVideoStatus,
    GetVideos,
    DeleteVideo
}