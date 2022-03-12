import React from 'react';

import Header from './Header/Header';
import Footer from './Footer/Footer';

import classes from './style.module.css';

const PageLayoutWrapper = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      <div className={classes.marginClass}>{children}</div>
      <Footer />
    </React.Fragment>
  );
};

export default PageLayoutWrapper;
