import axios from 'axios';
import { buildQuray } from '../helpers/utils';

const GetSetting = (payload) => {
  const params = buildQuray(payload);
  return axios.get(`/admin/settings${params}`);
}

const UpdateRDASetting = (payload) => {
  return axios.post('/admin/rda_settings/', payload);
}


export {
  GetSetting,
  UpdateRDASetting,
}