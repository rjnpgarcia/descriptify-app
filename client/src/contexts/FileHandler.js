import React, { createContext, useContext, useState } from "react";

const FileContext = createContext();

export const useFile = () => {
  return useContext(FileContext);
};

export const FileHandler = ({ children }) => {
  const [saveFile, setSaveFile] = useState({});
  const [getFile, setGetFile] = useState({});
  const [overwriteFile, setOverwriteFile] = useState({});

  const saveAsFile = async (
    fileName,
    id,
    onHide = null,
    setErrorMessage = null
  ) => {
    try {
      let transciptData = "";
      const res = await fetch(saveFile.audio);
      const audioBlob = await res.blob();
      const formData = new FormData();
      if (saveFile.stt) {
        transciptData = JSON.stringify(saveFile.transcript);
        formData.append("stt", saveFile.stt);
      } else if (saveFile.tts) {
        transciptData = saveFile.transcript;
        formData.append("tts", saveFile.tts);
      }
      formData.append(
        "audioFile",
        audioBlob,
        `${
          saveFile.tts ? fileName + "-tts-" + id : fileName + "-stt-" + id
        }.mp3`
      );
      formData.append("name", fileName);
      formData.append("transcript", transciptData);
      const response = await fetch(`http://localhost:8000/api/files/${id}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        if (onHide) {
          onHide();
        }
      } else {
        if (setErrorMessage) {
          setErrorMessage(data.error);
        }
      }
    } catch (error) {
      if (setErrorMessage) {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <FileContext.Provider
      value={{
        saveFile,
        saveAsFile,
        setSaveFile,
        getFile,
        setGetFile,
        overwriteFile,
        setOverwriteFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
