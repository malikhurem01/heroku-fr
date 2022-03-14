import React from "react";

import shortenWord from "../../Utils/shortenWord";

import classes from "./ProductsGrid.module.css";

const ProductsGrid = ({ products }) => {
  return (
    <div className={classes.products_grid}>
      {products.map((product) => {
        return (
          <a
            key={product.product_id}
            href={"/shop/product/" + product.product_id}
          >
            <div className={classes.grid_product}>
              <img src={product.image_main_url} alt="product on home page" />
              <p>{shortenWord(product.title, 22)}</p>
              <p className={classes.paragraph}>
                Start From <span>${product.start_price}</span>
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default ProductsGrid;
