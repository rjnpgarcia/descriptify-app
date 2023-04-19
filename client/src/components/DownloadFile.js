import React from "react";
import { useDownload } from "../contexts/DownloadHandler";
import "./componentsCSS/DownloadFile.css";

const DownloadFile = () => {
  const { dataDownload } = useDownload();

  const downloadHandler = () => {
    // Download Transcription and Audio
    if (dataDownload.transcript && dataDownload.audio) {
      const blobTranscript = new Blob([dataDownload.transcript], {
        type: "text/plain",
      });
      const TextUrl = URL.createObjectURL(blobTranscript);
      const linkText = document.createElement("a");
      linkText.download = "text-transcript.txt";
      linkText.href = TextUrl;
      linkText.click();

      const linkAudio = document.createElement("a");
      linkAudio.download = "audio-transcript.mp3";
      linkAudio.href = dataDownload.audio;
      linkAudio.click();
    }
  };
  return (
    <div className="export-button">
      <button
        onClick={downloadHandler}
        disabled={!dataDownload.audio || !dataDownload.transcript}
      >
        Export
      </button>
    </div>
  );
};

export default DownloadFile;
