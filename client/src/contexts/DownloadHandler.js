import React, { createContext, useContext, useState } from "react";

const DownloadContext = createContext("");

export const useDownload = () => {
  return useContext(DownloadContext);
};

export const DownloadHandler = ({ children }) => {
  const [dataDownload, setDataDownload] = useState({});

  return (
    <DownloadContext.Provider value={{ dataDownload, setDataDownload }}>
      {children}
    </DownloadContext.Provider>
  );
};
