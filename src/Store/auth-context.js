import React, { useCallback, useState } from "react";

const AuthContext = React.createContext({
  userDataState: null,
  userDataHandler: () => {},
  userTokenState: null,
  userTokenHandler: () => {},
  isUserLoggedIn: false,
  isUserLoggedInHandler: () => {},
  isDataFetched: true,
  isDataFetchedHandler: () => {},
});

export default AuthContext;

export const AuthContextProvider = (props) => {
  const [userDataState, setUserDataState] = useState(null);
  const [userTokenState, setUserTokenState] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(true);

  const userDataHandler = (user) => {
    setIsUserLoggedIn(user ? true : false);
    setUserDataState(user);
  };

  const userTokenHandler = (token) => {
    setUserTokenState(token);
  };

  const isUserLoggedInHandler = (state) => {
    setIsUserLoggedIn(state);
  };

  const isDataFetchedHandler = useCallback((state) => {
    setIsDataFetched(state);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userDataState: props.userData,
        userDataHandler: userDataHandler,
        userTokenState: userTokenState,
        userTokenHandler: userTokenHandler,
        isUserLoggedIn: isUserLoggedIn,
        isUserLoggedInHandler: isUserLoggedInHandler,
        isDataFetched: isDataFetched,
        isDataFetchedHandler: isDataFetchedHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
