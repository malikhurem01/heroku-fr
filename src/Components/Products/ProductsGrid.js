import React from "react";

import { Link } from "react-router-dom";

import shortenWord from "../../Utils/shortenWord";

import classes from "./ProductsGrid.module.css";

const ProductsGrid = ({ products }) => {
  return (
    <div className={classes.products_grid}>
      {products.map((product) => {
        return (
          <Link
            key={product.productId}
            to={"/shop/product?productId=" + product.productId}
          >
            <div className={classes.grid_product}>
              <img src={product.imageMainUrl} alt="product on home page" />
              <p>{shortenWord(product.title, 22)}</p>
              <p className={classes.paragraph}>
                Start From <span>${product.startPrice}</span>
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductsGrid;
