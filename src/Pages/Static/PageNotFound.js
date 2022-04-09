import React from "react";

import classes from "./PageNotFound.module.css";

const PageNotFound = () => {
  return (
    <div className={classes.error_container}>
      <h1>404 - Page not found</h1>
      <a href="/">Return to main page</a>
    </div>
  );
};

export default PageNotFound;
