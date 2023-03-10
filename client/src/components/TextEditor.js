import React from "react";
import "./TextEditor.css";

const TextEditor = ({ placeholder }) => {
  return (
    <div>
      <textarea rows="10" cols="50" placeholder={placeholder} />
    </div>
  );
};

export default TextEditor;
