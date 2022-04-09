import React from "react";

import classes from "./Shop.module.css";

const Subcategory = ({ subcategory, filterState }) => {
  const handleSubcategoryFilter = (ev) => {
    let hasSubcategoryFilter = false;
    if (ev.target.checked) {
      //Check if there is already the same subcategory in the filter, if yes, then do not add it again
      filterState.filters.subcategories.forEach((element) => {
        if (element.id === ev.target.id) {
          hasSubcategoryFilter = true;
        }
      });
      if (!hasSubcategoryFilter) {
        let filter = {
          subcategory: { id: parseInt(ev.target.id), name: ev.target.name },
        };
        filterState.handleAddFilter(filter);
      }
    } else {
      let filter = {
        subcategory: { id: parseInt(ev.target.id), name: ev.target.name },
      };
      filterState.handleRemoveFilter(filter);
    }
  };

  return (
    <li
      id={subcategory.name}
      key={subcategory.name}
      className={classes.subcategoryItem}
    >
      <input
        id={subcategory.id}
        name={subcategory.name}
        type="checkbox"
        defaultValue={subcategory.id}
        onClick={handleSubcategoryFilter}
      />
      <span>{subcategory.name}</span>
      <span>({subcategory.total})</span>
    </li>
  );
};

export default Subcategory;
