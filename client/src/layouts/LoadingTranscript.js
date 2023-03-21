import React from "react";
import "./layoutsCSS/LoadingTranscript.css";

const LoadingTranscript = () => {
  return (
    <button className="loading-transcription" disabled>
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span>Transcribing. . . . .</span>
    </button>
  );
};

export default LoadingTranscript;
