import React, { useContext } from "react";

import classes from "./NavigationList.module.css";

import AuthContext from "../../../Store/auth-context";

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
        {elements.map((el) => {
          return (
            <li key={el.label}>
              <a
                className={highlight === el.label ? classes.link_active : ""}
                href={el.route}
              >
                {el.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavigationList;
