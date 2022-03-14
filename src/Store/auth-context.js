import React, { useState } from 'react';

const AuthContext = React.createContext({
  userDataState: null,
  userDataHandler: () => {},
  userTokenState: null,
  userTokenHandler: () => {},
  isUserLoading: false,
  isUserLoadingHandler: () => {},
  isUserLoggedIn: false,
  isUserLoggedInHandler: () => {}
});

export default AuthContext;

export const AuthContextProvider = (props) => {
  const [userDataState, setUserDataState] = useState(null);
  const [userTokenState, setUserTokenState] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const userDataHandler = (user) => {
    setUserDataState(user);
  };

  const userTokenHandler = (token) => {
    setUserTokenState(token);
  };

  const isUserLoadingHandler = (state) => {
    setIsUserLoading(state);
  };

  const isUserLoggedInHandler = (state) => {
    setIsUserLoggedIn(state);
  };

  return (
    <AuthContext.Provider
      value={{
        userDataState: props.userData,
        userDataHandler: userDataHandler,
        userTokenState: userTokenState,
        userTokenHandler: userTokenHandler,
        isUserLoading: isUserLoading,
        isUserLoadingHandler: isUserLoadingHandler,
        isUserLoggedIn: isUserLoggedIn,
        isUserLoggedInHandler: isUserLoggedInHandler
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
