import axios from 'axios';

const GetPuzzleBanners = () => {
    return axios.get(`/api/wmm_puzzles`);
}
const GetContents = () => {
    return axios.get(`/api/wmm_contents`);
}

export {
    GetPuzzleBanners,
    GetContents
}