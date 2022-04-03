import React, { useContext } from "react";

import SocialMediaIcons from "../UI/SocialMediaIcons";
import NavigationList from "./Navigation/NavigationList";

import AuthContext from "../../Store/Context-API/auth-context";

import searchIcon from "../../Assets/Svg/searchIconSvg.svg";
import logo from "../../Assets/Svg/auction-app-logo.svg";

import classes from "./Header.module.css";

const Header = () => {
  const userContext = useContext(AuthContext);

  const user = userContext.userDataState;

  let isHidden =
    window.location.href.includes("/login") ||
    window.location.href.includes("/register");

  let highlightNav = window.location.href.includes("shop") ? "shop" : "home";

  return (
    <React.Fragment>
      <div className={isHidden ? classes.header_container : " "}>
        <header>
          <div className={classes.header_bar}>
            <SocialMediaIcons animate={true} />
            {user ? (
              <div className={classes.header_greeting}>
                Hi, &nbsp;
                {user.firstName + " " + user.lastName}
              </div>
            ) : (
              <div className={classes.login_buttons}>
                <span className={classes.sign_btn}>
                  <a href="/login">Login </a>
                </span>
                &emsp;
                <span className={classes.interText}>or</span>
                &emsp;
                <span className={classes.sign_btn}>
                  <a href="/register">Create an account </a>
                </span>
              </div>
            )}
          </div>
        </header>
        <nav>
          <div
            className={
              isHidden
                ? classes.navBar_container_hidden
                : classes.navBar_container
            }
          >
            <div className={classes.navBar_logo}>
              <a href="/">
                <img src={logo} alt="Auction app logo" />
              </a>
            </div>
            {isHidden ? (
              " "
            ) : (
              <React.Fragment>
                <div className={classes.navBar_searchBar}>
                  <input type="text" placeholder="Try enter: Shoes" />
                  <span className={classes.search_button}>
                    <img src={searchIcon} alt="search button" />
                  </span>
                </div>
                <NavigationList highlight={highlightNav} />
              </React.Fragment>
            )}
          </div>
        </nav>
      </div>
    </React.Fragment>
  );
};

export default Header;
