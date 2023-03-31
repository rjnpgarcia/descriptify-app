import React from "react";
import { useDownload } from "../contexts/DownloadHandler";
import "./componentsCSS/DownloadFile.css";

const DownloadFile = () => {
  const { dataTranscript, dataAudio } = useDownload();

  const downloadHandler = () => {
    console.log(dataTranscript);
    console.log(dataAudio);
    // Download Transcription from Speech-to-Text
    if (dataTranscript && !dataAudio) {
      const blob = new Blob([dataTranscript], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "speech-to-text.txt";
      link.href = url;
      link.click();
      // Download Audio Transcription from Text-to-Speech
    } else if (dataAudio && !dataTranscript) {
      const blob = new Blob([dataAudio], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "text-to-speech.mp3";
      link.href = url;
      link.click();
    }
  };
  return (
    <div className="export-button">
      <button
        onClick={downloadHandler}
        disabled={!dataAudio && !dataTranscript}
      >
        Export
      </button>
    </div>
  );
};

export default DownloadFile;
