import React, { useState } from "react";

import userService from "../../../Services/userService";

import validatePassword from "../../../Utils/validatePassword";

import {
  ERROR_PASSWORD,
  ERROR_USER,
  SERVER_ERROR,
} from "../../../Data/Constants/registration";

import classes from "./Registration.module.css";

const RegistrationForm = () => {
  const [error, setError] = useState(false);
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const registrationData = {
      first_name: ev.target.elements["firstName"].value,
      last_name: ev.target.elements["lastName"].value,
      email: ev.target.elements["email"].value,
      password: ev.target.elements["password"].value,
    };

    const { password } = registrationData;

    if (!validatePassword(password)) {
      setError(ERROR_PASSWORD);
      return;
    }

    return userService
      .register(registrationData)
      .then((response) => {
        console.log(response);
        window.location.replace("/login");
      })
      .catch((err) => {
        if (err.response.status === 409) setError(ERROR_USER);
        else if (err.response.status === 400) setError(ERROR_PASSWORD);
        else if (err.response.status === 500) setError(SERVER_ERROR);
      });
  };
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h5>Register</h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            required
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            required
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
          />
        </div>
        <div>
          <label htmlFor="email">Enter Email</label>
          <input
            required
            id="email"
            name="email"
            type="email"
            placeholder="user@domain.com"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            required
            id="password"
            name="password"
            type="password"
            placeholder="********"
          />
          <div className={classes.register_btn}>
            <input type="submit" value="register" />
          </div>
        </div>
      </form>
      {error && (
        <div className={classes.registration_error}>
          <p>{error}</p>
        </div>
      )}
      <div className={classes.alternative}>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
