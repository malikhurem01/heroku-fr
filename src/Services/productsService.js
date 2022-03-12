import axios from "axios";
import axiosConfig from "../Data/axios-config";

const fetchAllProducts = () => {
  return axios.get(axiosConfig.API_URL + "/get/products");
};

const fetchProductById = (id) => {
  return axios.get(axiosConfig.API_URL + "/get/product/" + id);
};

const services = {
  fetchAllProducts,
  fetchProductById,
};

export default services;
