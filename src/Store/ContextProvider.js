import React from "react";
import { AppContextProvider } from "./Context-API/app-context";
import { AuthContextProvider } from "./Context-API/auth-context";

const ContextProvider = ({ user, children }) => {
  return (
    <AuthContextProvider userData={user}>
      <AppContextProvider>{children}</AppContextProvider>
    </AuthContextProvider>
  );
};

export default ContextProvider;
