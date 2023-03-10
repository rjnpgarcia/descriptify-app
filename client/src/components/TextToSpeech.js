import React from "react";

const TextToSpeech = () => {
  return (
    <div className="buttons-container">
      <div className="controls-container">
        <button>Play</button>
        <button>Stop</button>
        <button>Delete</button>
      </div>
      <div className="file-buttons-container">
        <button>Import Text File</button>
        <button>Export Audio</button>
      </div>
    </div>
  );
};

export default TextToSpeech;
