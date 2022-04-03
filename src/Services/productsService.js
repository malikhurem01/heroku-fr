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

const fetchBySubcategoryId = (id, sort, offset) => {
  return axios.get(
    axiosConfig.API_URL +
      "/get/products?Id=" +
      id +
      "filter=subcategory" +
      "&sort=" +
      sort +
      "&offset=" +
      offset
  );
};

const fetchByCategoryId = (id, sort, offset) => {
  return axios.get(
    axiosConfig.API_URL +
      "/get/products?filter=category&id=" +
      id +
      "&sort=" +
      sort +
      "&offset=" +
      offset
  );
};

const services = {
  fetchAllProducts,
  fetchProductById,
  fetchByCategoryId,
  fetchBySubcategoryId,
};

export default services;
