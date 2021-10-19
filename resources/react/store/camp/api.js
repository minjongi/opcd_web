import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const PostCamp = (id, payload) => {
    if(id){
        return axios.post(`/admin/campaigns/${id}`, payload);
    }else{
        return axios.post(`/admin/campaigns`, payload);
    }
}
const UpdateCampStatus = (id, payload) => {
    return axios.post(`/admin/campaign_status/${id}`, payload);
}
const GetCamps = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/campaigns${params}`);
}
const DeleteCamp = (id) => {
    return axios.delete(`/admin/campaigns/${id}`);
}
const GetCampNameList = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/campaign_names${params}`);
}


const PostCampForm = (id, payload) => {
    if(id){
        return axios.post(`/admin/applicant_forms/${id}`, payload);
    }else{
        return axios.post(`/admin/applicant_forms`, payload);
    }
}
const UpdateCampFormStatus = (id, payload) => {
    return axios.post(`/admin/applicant_form_status/${id}`, payload);
}
const GetCampForms = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/applicant_forms${params}`);
}
const GetCampForm = (id) => {
    return axios.get(`/admin/applicant_forms/${id}`);
}
const DeleteCampForm = (id) => {
    return axios.delete(`/admin/applicant_forms/${id}`);
}


const PostApplicant = (id, payload) => {
    if(id){
        return axios.post(`/admin/applicants/${id}`, payload);
    }else{
        return axios.post(`/admin/applicants`, payload);
    }
}
const UpdateApplicantStatus = (id, payload) => {
    return axios.post(`/admin/applicant_status/${id}`, payload);
}
const GetApplicants = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/applicants${params}`);
}
const GetApplicant = (id) => {
    return axios.get(`/admin/applicants/${id}`);
}
const DeleteApplicant = (id) => {
    return axios.delete(`/admin/applicants/${id}`);
}

export {
    PostCamp,
    UpdateCampStatus,
    GetCamps,
    DeleteCamp,
    GetCampNameList,

    PostCampForm,
    UpdateCampFormStatus,
    GetCampForms,
    GetCampForm,
    DeleteCampForm,

    PostApplicant,
    UpdateApplicantStatus,
    GetApplicants,
    GetApplicant,
    DeleteApplicant
}