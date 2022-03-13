import React from "react";

import classes from "./ProductOverviewPage.module.css";

const Notification = ({ state, message }) => {
  return (
    <div
      className={
        classes.bid_notification_container +
        " " +
        (state === "ERROR"
          ? classes.bid_notification_error
          : state === "SUCCESS"
          ? classes.bid_notification_success
          : "")
      }
    >
      <p>{message}</p>
    </div>
  );
};

export default Notification;
