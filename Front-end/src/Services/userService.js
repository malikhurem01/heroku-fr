import axios from 'axios';
import axiosConfig from '../Data/axios-config';

const login = async data => {
  return axios.post(axiosConfig.API_URL + '/authenticate', {
    userName: data.userName,
    password: data.password
  });
};

const register = registrationData => {
  return axios.post(axiosConfig.API_URL + '/registration', registrationData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const currentUser = token => {
  return axios.get(axiosConfig.API_URL + '/auth/users/current', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  });
};

const services = {
  login,
  register,
  currentUser
};

export default services;
