import React, { useContext } from "react";

import SocialMediaIcons from "../UI/SocialMediaIcons";
import NavigationList from "./Navigation/NavigationList";

import AuthContext from "../../Store/Context-API/auth-context";
import AppContext from "../../Store/Context-API/app-context";

import searchIcon from "../../Assets/Svg/searchIconSvg.svg";
import logo from "../../Assets/Svg/auction-app-logo.svg";

import classes from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  const { userDataState } = useContext(AuthContext);
  const { isNavHidden, handleIsNavHidden } = useContext(AppContext);

  const user = userDataState;

  if (window.location.href.includes("logout")) {
    handleIsNavHidden(true);
  }

  let highlightNav = window.location.href.includes("shop") ? "shop" : "home";

  return (
    <React.Fragment>
      <div className={isNavHidden ? classes.header_container : " "}>
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
                  <Link to="/login" onClick={() => handleIsNavHidden(true)}>
                    Login{" "}
                  </Link>
                </span>
                &emsp;
                <span className={classes.interText}>or</span>
                &emsp;
                <span className={classes.sign_btn}>
                  <Link to="/register" onClick={() => handleIsNavHidden(true)}>
                    Create an account{" "}
                  </Link>
                </span>
              </div>
            )}
          </div>
        </header>
        <nav>
          <div
            className={
              isNavHidden
                ? classes.navBar_container_hidden
                : classes.navBar_container
            }
          >
            <div className={classes.navBar_logo}>
              <Link to="/" onClick={() => handleIsNavHidden(false)}>
                <img src={logo} alt="Auction app logo" />
              </Link>
            </div>
            {isNavHidden ? (
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
