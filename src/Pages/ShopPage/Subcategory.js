import React, { useCallback, useContext, useEffect, useRef } from "react";

import AppContext from "../../Store/Context-API/app-context";

import classes from "./Shop.module.css";

const Subcategory = ({ subcategory }) => {
  const inputField = useRef();
  const { filters, handleSubcategoryFilter } = useContext(AppContext);

  const handleIsChecked = useCallback(() => {
    inputField.current.checked = false;
    try {
      filters.subcategories.forEach(({ id }) => {
        if (id === subcategory.id) {
          inputField.current.checked = true;
          throw new MessageEvent("Break the loop");
        }
      });
    } catch {}
  }, [filters, subcategory.id]);

  useEffect(() => {
    handleIsChecked();
  }, [handleIsChecked]);

  return (
    <li
      id={subcategory.name}
      data-categoryid={subcategory.categoryId}
      key={subcategory.name}
      className={classes.subcategoryItem}
    >
      <input
        ref={inputField}
        id={subcategory.id}
        name={subcategory.name}
        type="checkbox"
        defaultValue={subcategory.id}
        onChange={handleSubcategoryFilter}
      />
      <span>{subcategory.name}</span>
      <span>({subcategory.total})</span>
    </li>
  );
};

export default Subcategory;
