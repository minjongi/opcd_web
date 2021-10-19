import axios from 'axios';
import { buildQuray } from '../../helpers/utils';

const GetRdaOptions = () => {
    return axios.get(`/api/rda_options`);
}
const PostRda = (payload) => {
    return axios.post(`/api/rda`, payload);
}
const GetRdaCampaings = () => {
    return axios.get(`/api/rda_campaigns`);
}
const PostRdaCampaingRequest = (payload) => {
    return axios.post(`/api/rda_campaign_request`, payload);
}

// ADMIN APIs
const PostRdaCampaign = (id, payload) => {
    if(id){
        return axios.post(`/admin/rda_campaign/${id}`, payload);
    }else{
        return axios.post(`/admin/rda_campaign`, payload);
    }
}
const GetRdaCampaignList = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/rda_campaign${params}`);
}
const DeleteRdaCampaign = (id) => {
    return axios.delete(`/admin/rda_campaign/${id}`);
}
const UpdateRdaCampaignStatus = (id, payload) => {
    return axios.post(`/admin/rda_campaign_status/${id}`, payload);
}

const GetRdaList = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/rdas${params}`);
}
const DeleteRda = (id) => {
    return axios.delete(`/admin/rdas/${id}`);
}
const UpdateRdaStatus = (id, payload) => {
    return axios.post(`/admin/rda_status/${id}`, payload);
}
const ZipDownload = (payload) => {
    return axios.post('/admin/rda_zip_download', payload);
}
const ExcelDownload = (payload) => {
    return axios.post('/admin/rda_excel_download', payload, {responseType: 'blob'});
}
const FileDownload = (id) => {
    return axios.post(`/admin/rda_file_download`, {id}, {responseType: 'blob'});
}

const GetRdaLogos = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/rda_logo${params}`);
}
const PostLogo = (payload) => {
    return axios.post('/admin/rda_logo', payload);
}
const DeleteLogo = (id) => {
    return axios.delete(`/admin/rda_logo/${id}`);
}
const UpdateLogoStatus = (id, payload) => {
    return axios.post(`/admin/rda_logo_status/${id}`, payload);
}

const GetRdaMusics = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/rda_music${params}`);
}
const PostMusic = (payload) => {
    return axios.post('/admin/rda_music', payload);
}
const DeleteMusic = (id) => {
    return axios.delete(`/admin/rda_music/${id}`);
}
const UpdateMusicStatus = (id, payload) => {
    return axios.post(`/admin/rda_music_status/${id}`, payload);
}

const GetRdaContents = () => {
    return axios.get('/admin/rda_content');
}
const UpdateRdaContents = (payload) => {
    return axios.post('/admin/rda_content', payload);
}

const GetRdaFaqs = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/rda_faq${params}`);
}
const PostFaq = (payload) => {
    return axios.post('/admin/rda_faq', payload);
}
const DeleteFaq = (id) => {
    return axios.delete(`/admin/rda_faq/${id}`);
}
const UpdateFaqStatus = (id, payload) => {
    return axios.post(`/admin/rda_faq_status/${id}`, payload);
}

const PostRdaBanner = (id, payload) => {
    if(id){
        return axios.post(`/admin/rda_banner/${id}`, payload);
    }else{
        return axios.post(`/admin/rda_banner`, payload);
    }
}
const UpdateRdaBannerStatus = (id, payload) => {
    return axios.post(`/admin/rda_banner_status/${id}`, payload);
}
const GetRdaBanners = (payload) => {
    const params = buildQuray(payload);
    return axios.get(`/admin/rda_banner${params}`);
}
const DeleteRdaBanner = (id) => {
    return axios.delete(`/admin/rda_banner/${id}`);
}

export {
    GetRdaOptions,
    PostRda,

    PostRdaCampaign,
    GetRdaCampaignList,
    DeleteRdaCampaign,
    UpdateRdaCampaignStatus,

    GetRdaList,
    DeleteRda,
    UpdateRdaStatus,
    ZipDownload,
    ExcelDownload,
    FileDownload,

    GetRdaLogos,
    PostLogo,
    DeleteLogo,
    UpdateLogoStatus,

    GetRdaMusics,
    PostMusic,
    DeleteMusic,
    UpdateMusicStatus,

    GetRdaContents,
    UpdateRdaContents,

    GetRdaFaqs,
    PostFaq,
    DeleteFaq,
    UpdateFaqStatus,

    GetRdaCampaings,
    PostRdaCampaingRequest,

    PostRdaBanner,
    UpdateRdaBannerStatus,
    GetRdaBanners,
    DeleteRdaBanner
}