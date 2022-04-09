import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../../Store/Context-API/auth-context";

import classes from "./NavigationList.module.css";

const NavigationList = ({ highlight }) => {
  const userContext = useContext(AuthContext);
  const elements = [
    { label: "home", route: "/" },
    { label: "shop", route: "/shop" },
    { label: "account", route: "/account" },
  ];
  if (userContext.userDataState) {
    elements.push({ label: "logout", route: "/logout" });
  }
  return (
    <div className={classes.navBar_navigation}>
      <ul>
        {elements.map(({ label, route }) => {
          return (
            <li key={label}>
              <Link
                className={highlight === label ? classes.link_active : ""}
                to={route}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavigationList;
