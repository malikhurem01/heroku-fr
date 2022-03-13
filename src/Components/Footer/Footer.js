import React from 'react';

import SocialMediaIcons from '../UI/SocialMediaIcons';

import classes from './Footer.module.css';

const Footer = () => {
  return (
    <React.Fragment>
      <footer>
        <div className={classes.footerContainer}>
          <div className={classes.footer_about}>
            <p>Auction</p>
            <ul>
              <li>
                <a href="/about-us">About Us</a>
              </li>
              <li>
                <a href="/terms-and-conditions">Terms and Conditions</a>
              </li>
              <li>
                <a href="/privacy-and-policy">Privacy and Policy</a>
              </li>
            </ul>
          </div>
          <div className={classes.footer_get_in_touch}>
            <p>Get in touch</p>
            <ul>
              <li>
                Call Us at
                <span className={classes.phoneNumber}>+123 797-567-2535</span>
              </li>
              <li>
                <a href="mailto: support@auction.com">support@auction.com</a>
              </li>
              <li>
                <SocialMediaIcons animate={true} />
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
