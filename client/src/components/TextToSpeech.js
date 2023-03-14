import React from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import "./componentsCSS/TextToSpeech.css";
// Components
import DownloadFile from "./DownloadFile";
import TextEditor from "./TextEditor";

const TextToSpeech = () => {
  return (
    <Container>
      <h3 className="feature-title">
        <i class="fa-solid fa-feather-pointed"></i> Text to Speech
      </h3>
      <Row>
        <DownloadFile />
      </Row>
      <Row className="justify-content-center mt-3">
        <TextEditor placeholder="Enter text here" />
      </Row>
      <Row className="justify-content-center">
        <div className="tts-buttons-container">
          <div className="tts-controls-container">
            <button>
              <i class="fa-solid fa-stop"></i>
            </button>
            <button className="tts-play-button">
              <i class="fa-solid fa-play" style={{ color: "#05a705" }}></i>
            </button>
            <button>
              <i class="fa-solid fa-delete-left"></i>
            </button>
          </div>
          <div className="tts-import-container">
            <button>Import Text File</button>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default TextToSpeech;
