import React, { useState } from "react";
import { setToken } from "../../../Services/authService";

import userService from "../../../Services/userService";

import classes from "./Login.module.css";

const LoginForm = () => {
  const [error, setError] = useState(false);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    let authData = {
      userName: ev.target.elements["username"].value,
      password: ev.target.elements["password"].value,
    };
    userService
      .login(authData)
      .then((response) => {
        const tokenObj = {
          access_token: response.data.jwt_access,
          refresh_token: response.data.jwt_refresh,
        };
        setToken(tokenObj);
        window.location.replace("/");
      })
      .catch((err) => {
        setError(true);
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h5>Login</h5>
      </div>
      <form
        method="POST"
        action="http://localhost:8083/api/v1/authenticate"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="username">Enter Email</label>
          <input
            required
            id="email"
            name="username"
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

          <div className={classes.login_btn}>
            <input type="submit" value="login" />
          </div>
        </div>
      </form>
      {error && (
        <div className={classes.login_error}>
          <p>Wrong username or password, please try again.</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
