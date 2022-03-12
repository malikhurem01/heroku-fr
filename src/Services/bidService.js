import axios from "axios";

import axiosConfig from "../Data/axios-config";

const makeBid = (token, data) => {
  return axios.post(axiosConfig.API_URL + "/post/bid", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
};

const getBidHistory = (product_id) => {
  return axios.get(axiosConfig.API_URL + "/get/bid-history/" + product_id);
};

const services = {
  makeBid,
  getBidHistory,
};

export default services;
