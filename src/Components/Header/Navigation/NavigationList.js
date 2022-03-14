import React from 'react';

import classes from './NavigationList.module.css';

const NavigationList = ({ highlight }) => {
  const elements = [
    { label: 'home', route: '/' },
    { label: 'shop', route: '/shop' },
    { label: 'account', route: '/account' }
  ];
  return (
    <div className={classes.navBar_navigation}>
      <ul>
        {elements.map(el => {
          return (
            <li key={el.label}>
              <a
                className={highlight === el.label ? classes.link_active : ''}
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
