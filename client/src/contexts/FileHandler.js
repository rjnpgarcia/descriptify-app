import React, { createContext, useContext, useState } from "react";

const FileContext = createContext();

export const useFile = () => {
  return useContext(FileContext);
};

export const FileHandler = ({ children }) => {
  const [saveFile, setSaveFile] = useState({});
  const [getFile, setGetFile] = useState({});

  return (
    <FileContext.Provider
      value={{ saveFile, setSaveFile, getFile, setGetFile }}
    >
      {children}
    </FileContext.Provider>
  );
};
