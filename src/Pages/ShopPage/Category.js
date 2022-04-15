import React, { useContext } from "react";

import AppContext from "../../Store/Context-API/app-context";

import Subcategory from "./Subcategory";
import { Link } from "react-router-dom";

import plusSvg from "../../Assets/Svg/plusSvg.svg";
import minusSvg from "../../Assets/Svg/minusSvg.svg";

import classes from "./Shop.module.css";

const Category = ({ category }) => {
  //Handle + and - icons next to category title
  const { handleCategoryFilter } = useContext(AppContext);
  const handleCategoryDropdown = ({ target }) => {
    const targetElement = target;
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
        <Link
          to={"/shop"}
          onClick={() =>
            handleCategoryFilter(category.id, category.name, "add")
          }
        >
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
          return <Subcategory key={sub.name} subcategory={sub} />;
        })}
      </ul>
    </React.Fragment>
  );
};

export default Category;
