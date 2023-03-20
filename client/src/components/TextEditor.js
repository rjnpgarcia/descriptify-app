import React from "react";
import "./componentsCSS/TextEditor.css";

const TextEditor = ({ placeholder, transcript, handler, cols }) => {
  return (
    <>
      <textarea
        rows="13"
        cols="50"
        placeholder={placeholder}
        value={transcript}
        onChange={handler}
      />
    </>
  );
};

export default TextEditor;
