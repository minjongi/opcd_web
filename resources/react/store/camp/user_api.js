import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const GetCampains = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/api/campaigns${params}`);
}

const PostProposeFile = (payload) => {
    return axios.post('/api/propose_file', payload);
}

const PostPropose = (payload) => {
    return axios.post('/api/propose', payload);
}

const GetApplicants = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/api/applicants${params}`);
}

const GetApplicant = (id) => {
    return axios.get(`/api/applicant/${id}`);
}

const GetMyApplicants = () => {
    return axios.get(`/api/my_applicants`);
}

export {
    GetCampains,
    PostProposeFile,
    PostPropose,

    GetApplicants,
    GetApplicant,
    GetMyApplicants
}