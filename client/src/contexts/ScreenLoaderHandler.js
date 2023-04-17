import React, { createContext, useContext, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import "./contextsCSS/ScreenLoaderHandler.css";

const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const ScreenLoaderHandler = ({ children }) => {
  const [loadingScreen, setLoadingScreen] = useState(false);
  return (
    <LoadingContext.Provider value={{ setLoadingScreen }}>
      {loadingScreen ? (
        <div className="screen-loader-container">
          <HashLoader loading={loadingScreen} color="#8a93e2" />
        </div>
      ) : (
        ""
      )}
      {children}
    </LoadingContext.Provider>
  );
};
