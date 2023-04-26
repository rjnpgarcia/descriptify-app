import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthHandler = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const tokenName = "loggedInUser";
  const pageStorageName = "lastVisitedPage";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        tokenName,
        pageStorageName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
