import React from "react";

import plusSvg from "../../Assets/Svg/plusSvg.svg";
import minusSvg from "../../Assets/Svg/minusSvg.svg";

import classes from "./Shop.module.css";
import Subcategory from "./Subcategory";
import { Link } from "react-router-dom";

const Category = ({ category, filterState }) => {
  //Handle + and - icons next to category title
  const handleCategoryDropdown = (ev) => {
    const targetElement = ev.target;
    const contentElement = document.getElementById(
      targetElement.parentNode.id + "_subcategory"
    );
    if (contentElement.style.maxHeight) {
      targetElement.src = plusSvg;
      contentElement.style.maxHeight = null;
    } else {
      targetElement.src = minusSvg;
      contentElement.style.maxHeight = contentElement.scrollHeight + "px";
    }
  };

  return (
    <React.Fragment>
      <li
        id={category.name}
        key={category.name}
        className={classes.collapsible}
      >
        <Link to={"/shop"}>
          <p>{category.name}</p>
        </Link>
        <img
          onClick={handleCategoryDropdown}
          src={plusSvg}
          alt="filter collapse icon"
        />
      </li>
      <ul id={category.name + "_subcategory"} className={classes.content}>
        {category.subcategories.map((sub) => {
          return (
            <Subcategory
              key={sub.name}
              subcategory={sub}
              filterState={filterState}
            />
          );
        })}
      </ul>
    </React.Fragment>
  );
};

export default Category;
