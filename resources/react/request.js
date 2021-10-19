import axios from 'axios';

import { deleteUser } from './store/actions';
import { clearAccessToken, getAccessToken } from './helpers/authority';

const configRequest = (dispatch) => {
  
  axios.defaults.baseURL = process.env.MIX_API_URL;

  axios.interceptors.request.use(
    config => {

      let token = getAccessToken();

      if(token) config.headers['Authorization'] = `Bearer ${token}`;
      
      config.headers['Content-Type'] = "application/json";
      
      return config;
    },
    error => {
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response && error.response.status === 401) {
        clearAccessToken();
        dispatch(deleteUser());
      }
  
      return Promise.reject(error);
    }
  )
}

export default configRequest;