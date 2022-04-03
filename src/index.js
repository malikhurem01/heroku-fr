import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { setToken, refreshToken } from "./Services/authService";

import userService from "./Services/userService";
import sessionRemove from "./Utils/sessionRemove";
import ContextProvider from "./Store/ContextProvider";

const initialize = async () => {
  let token = JSON.parse(sessionStorage.getItem("user_jwt"));
  if (token) {
    let response,
      user,
      statusCode = 403;
    try {
      response = await userService.currentUser(token.access_token);
      user = response.data;
      statusCode = response.status;
    } catch (err) {
      if (parseInt(statusCode) === 403) {
        // Checks whether the response code is forbidden, if it is, then sends the refresh token and gets the new access token
        let tokenResponse, tokenResponseBody;
        try {
          tokenResponse = await refreshToken(token.refresh_token);
          tokenResponseBody = tokenResponse.data;
          const tokenObj = {
            access_token: tokenResponseBody.jwt_access,
            refresh_token: tokenResponseBody.jwt_refresh,
          };
          setToken(tokenObj);
        } catch (err) {
          // It means that the refresh token has also expired
          sessionRemove();
          return null;
        }
        try {
          response = await userService.currentUser(
            tokenResponseBody.jwt_access
          );
          user = response.data.user;
        } catch (err) {
          sessionRemove();
          return null;
        }
      }
    }
    return user;
  } else {
    sessionRemove();
    return null;
  }
};

const startApplication = (user) => {
  ReactDOM.render(
    <ContextProvider user={user}>
      <App />
    </ContextProvider>,
    document.getElementById("root")
  );
};

initialize().then(startApplication);
