import React, { useState } from "react";

import classes from "./Modal.module.css";

const Modal = ({ title, message }) => {
  const [classesState, setClassesState] = useState(
    `${classes.backdrop_container}`
  );
  const handleHideModal = () => {
    setClassesState(`${classes.hidden}`);
  };
  return (
    <div onClick={handleHideModal} className={classesState}>
      <div className={classes.modal}>
        <div className={classes.success}>{title}</div>
        <div className={classes.modal_message}>{message}</div>
        <div className={classes.modal_exit_button}>
          <p onClick={handleHideModal}>Continue</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
