import React from 'react';

import arrow from '../../../Assets/locationArrowRight.svg';

import classes from './NavLocation.module.css';

const NavLocation = ({ location, path }) => {
  return (
    <div className={classes.locationContainer}>
      <p className={classes.locationTitle}>{location}</p>
      <p className={classes.locationPath}>
        <span className={classes.path_main}>{path.main}</span>
        <span className={classes.path_arrow}>
          <img src={arrow} alt="arrow" />
        </span>
        <span className={classes.path_page}>{path.page}</span>
      </p>
    </div>
  );
};

export default NavLocation;
