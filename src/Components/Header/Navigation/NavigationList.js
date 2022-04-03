import React, { useContext } from "react";

import classes from "./NavigationList.module.css";

import AuthContext from "../../../Store/Context-API/auth-context";

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
              <a
                className={highlight === label ? classes.link_active : ""}
                href={route}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavigationList;
