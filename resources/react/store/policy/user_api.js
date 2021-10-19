import axios from 'axios';

const GetPolicies = () => {
    return axios.get(`/api/policies`);
}
export {
    GetPolicies
}