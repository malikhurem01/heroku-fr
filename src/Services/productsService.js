import axios from "axios";
import axiosConfig from "../Data/axios-config";

const fetchAllProducts = (sort) => {
  return axios.get(
    axiosConfig.API_URL +
      (sort ? "/get/products?sort=" + sort : "/get/products")
  );
};

const fetchProductById = (id) => {
  return axios.get(axiosConfig.API_URL + "/get/product?productId=" + id);
};

const services = {
  fetchAllProducts,
  fetchProductById,
};

export default services;
