import axios from 'axios';

const GetMainBanners = () => {
    return axios.get(`/api/main_banners`);
}

const GetMainData = () => {
    return axios.get(`/api/home`);
}

const SearchSite = (search) => {
    return axios.get(`/api/search${search}`);
}

export {
    GetMainBanners,
    GetMainData,

    SearchSite
}