import React from "react";

import ProductCard from "./ProductCard";

import classes from "./ProductsGrid.module.css";

const ProductsGrid = ({ products }) => {
  return (
    <div className={classes.products_grid}>
      {products.map((p) => {
        return <ProductCard key={p.product.productId} product={p.product} />;
      })}
    </div>
  );
};

export default ProductsGrid;
