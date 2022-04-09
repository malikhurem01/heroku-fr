import React from "react";

import classes from "./ProductOverviewPage.module.css";

const Notification = ({ state, message }) => {
  let classList;
  if (state === "ERROR")
    classList = `${classes.bid_notification_container} ${classes.bid_notification_error}`;
  else if (state === "SUCCESS")
    classList = `${classes.bid_notification_container} ${classes.bid_notification_success}`;
  return (
    <div className={classList}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
