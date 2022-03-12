import React from 'react';

import classes from '../Footer.module.css';

const SubscribeElement = () => {
  return (
    <div className={classes.footer_subscribe}>
      <p>Newsletter</p>
      <ul>
        <li>
          Enter your email address and get notified about
          <br />
          new products. We hate spam!
        </li>
        <li>
          <input type="email" placeholder="Your Email Address" />
          <a href="/#" className={classes.btn}>
            GO{' '}
            <div className={classes.arrow}>
              <img src={arrow} alt="arrow" />
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
};
