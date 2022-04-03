import React from "react";

import plusSvg from "../../Assets/Svg/plusSvg.svg";
import minusSvg from "../../Assets/Svg/minusSvg.svg";

import classes from "./Shop.module.css";
import Subcategory from "./Subcategory";

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

const Category = ({ category }) => {
  return (
    <React.Fragment>
      <li
        id={category.name}
        key={category.name}
        className={classes.collapsible}
      >
        <p>{category.name}</p>
        <img
          onClick={handleCategoryDropdown}
          src={plusSvg}
          alt="filter collapse icon"
        />
      </li>
      <ul id={category.name + "_subcategory"} className={classes.content}>
        {category.subcategoryDTOList.map((sub) => {
          return <Subcategory key={sub.name} subcategory={sub} />;
        })}
      </ul>
    </React.Fragment>
  );
};

export default Category;
