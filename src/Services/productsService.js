import axios from "axios";
import axiosConfig from "../Data/axios-config";

const fetchAllProducts = (sort, offset = 0) => {
  return axios.get(
    axiosConfig.API_URL +
      (sort
        ? "/get/products?sort=" + sort + "&offset=" + offset
        : "/get/products?offset=" + offset)
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
