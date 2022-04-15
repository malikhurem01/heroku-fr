import axios from "axios";
import axiosConfig from "../Data/axios-config";

const fetchAllCategories = () => {
  return axios.get(axiosConfig.API_URL + "/get/categories");
};

const services = { fetchAllCategories };

export default services;
