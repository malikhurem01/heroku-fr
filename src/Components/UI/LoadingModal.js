import React from "react";

import loadingSvg from "../../Assets/Svg/loadingLines.svg";

import classes from "./LoadingModal.module.css";

const LoadingModal = () => {
  return (
    <div className={classes.backdrop_container}>
      <div className={classes.modal}>
        <img src={loadingSvg} alt="no loading svg" />
      </div>
    </div>
  );
};

export default LoadingModal;
