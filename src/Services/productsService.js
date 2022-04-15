import axios from "axios";
import axiosConfig from "../Data/axios-config";

const fetchProductById = (id) => {
  return axios.get(axiosConfig.API_URL + "/get/product?productId=" + id);
};

const fetchProducts = (filters) => {
  return axios.post(axiosConfig.API_URL + "/get/products", filters, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const services = {
  fetchProductById,
  fetchProducts,
};

export default services;
