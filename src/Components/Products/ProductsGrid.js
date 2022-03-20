import React from "react";

import { Link } from "react-router-dom";

import shortenWord from "../../Utils/shortenWord";

import classes from "./ProductsGrid.module.css";

const ProductsGrid = ({ products }) => {
  return (
    <div className={classes.products_grid}>
      {products.map(({ productId, imageMainUrl, title, startPrice }) => {
        return (
          <Link key={productId} to={"/shop/product?productId=" + productId}>
            <div className={classes.grid_product}>
              <img src={imageMainUrl} alt="product on home page" />
              <p>{shortenWord(title, 22)}</p>
              <p className={classes.paragraph}>
                Start From <span>${startPrice}</span>
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductsGrid;
