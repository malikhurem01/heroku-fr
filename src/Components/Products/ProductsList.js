import React from "react";

import { Link } from "react-router-dom";

import classes from "./ProductsList.module.css";

const ProductsList = ({ products }) => {
  return (
    <div className={classes.productsList}>
      {products.map(({ product }) => {
        return (
          <Link
            key={product.productId}
            to={"/shop/product?productId=" + product.productId}
          >
            <div className={classes.productItem}>
              <img src={product.imageMainUrl} alt="list view" />
              <div className={classes.productDescription}>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <h2>Start From ${product.startPrice}</h2>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductsList;
