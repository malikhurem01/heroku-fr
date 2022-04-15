import React from "react";
import { Link } from "react-router-dom";
import shortenWord from "../../Utils/shortenWord";

import classes from "./ProductsGrid.module.css";

const ProductCard = ({ product }) => {
  return (
    <Link to={"/shop/product?productId=" + product.productId}>
      <div className={classes.grid_product}>
        <div className={classes.image_container}>
          <img src={product.imageMainUrl} alt="product on home page" />
        </div>
        <p>{shortenWord(product.title, 22)}</p>
        <p className={classes.paragraph}>
          Start From <span>${product.startPrice}</span>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
