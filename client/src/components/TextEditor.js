import React from "react";
import "./componentsCSS/TextEditor.css";

const TextEditor = ({ placeholder, transcript, handler }) => {
  return (
    <>
      <textarea
        rows="15"
        cols="50"
        placeholder={placeholder}
        value={transcript}
        onChange={handler}
      />
    </>
  );
};

export default TextEditor;
