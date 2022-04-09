import React from "react";

const AuthContext = React.createContext({
  userDataState: null,
});

export default AuthContext;

export const AuthContextProvider = ({ children, userData }) => {
  return (
    <AuthContext.Provider
      value={{
        userDataState: userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
