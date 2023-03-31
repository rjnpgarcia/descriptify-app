import React, { createContext, useContext, useState } from "react";

const DownloadContext = createContext("");

export const useDownload = () => {
  return useContext(DownloadContext);
};

export const DownloadHandler = ({ children }) => {
  const [dataTranscript, setDataTranscript] = useState("");
  const [dataAudio, setDataAudio] = useState(null);

  return (
    <DownloadContext.Provider
      value={{ dataTranscript, setDataTranscript, dataAudio, setDataAudio }}
    >
      {children}
    </DownloadContext.Provider>
  );
};
