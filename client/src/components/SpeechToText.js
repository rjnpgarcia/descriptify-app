import React from "react";

const SpeechToText = () => {
  return (
    <div className="buttons-container">
      <div className="controls-container">
        <button>Record</button>
        <button>Play</button>
        <button>Stop</button>
        <button>Replace</button>
      </div>
      <div className="file-buttons-container">
        <button>Import Audio</button>
        <button>Export Text File</button>
      </div>
    </div>
  );
};

export default SpeechToText;
