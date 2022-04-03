import React from "react";

import classes from "./Shop.module.css";

const Subcategory = ({ subcategory }) => {
  return (
    <li key={subcategory.name} className={classes.subcategoryItem}>
      <input type="checkbox" defaultValue={subcategory.id} />
      <span>{subcategory.name}</span>
      <span>({subcategory.total})</span>
    </li>
  );
};

export default Subcategory;
