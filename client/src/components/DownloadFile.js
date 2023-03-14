import React from "react";
import "./componentsCSS/DownloadFile.css";

const DownloadFile = ({ fileType }) => {
  return (
    <div className="export-button">
      <button>Export {fileType}</button>
    </div>
  );
};

export default DownloadFile;
