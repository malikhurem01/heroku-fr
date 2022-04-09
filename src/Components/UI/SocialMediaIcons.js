import React from "react";
import classes from "./SocialMediaIcons.module.css";

import facebookIcon from "../../Assets/Svg/facebookSvg.svg";
import instagramIcon from "../../Assets/Svg/instagramSvg.svg";
import twitterIcon from "../../Assets/Svg/twitterSvg.svg";

const SocialMediaIcons = ({ animate }) => {
  return (
    <React.Fragment>
      <span className={animate ? classes.animate : ""}>
        <span className={classes.icons}>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
            <img src={facebookIcon} alt="facebook social media icon" />
          </a>
        </span>
        <span className={classes.icons}>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            <img src={instagramIcon} alt="instagram social media icon" />
          </a>
        </span>
        <span className={classes.icons}>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            <img src={twitterIcon} alt="twitter social media icon" />
          </a>
        </span>
      </span>
    </React.Fragment>
  );
};

export default SocialMediaIcons;
