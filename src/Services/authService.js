import axios from 'axios';
import axiosConfig from '../Data/axios-config';

export const refreshToken = refresh_token => {
  return axios.post(axiosConfig.API_URL + '/auth/refresh', refreshToken, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + refresh_token
    }
  });
};

export const setToken = user_jwt => {
  sessionStorage.removeItem('user_jwt');
  sessionStorage.setItem('user_jwt', JSON.stringify(user_jwt));
};
