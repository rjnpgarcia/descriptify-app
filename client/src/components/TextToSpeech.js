import React from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import "./componentsCSS/TextToSpeech.css";
// Components
import TextEditor from "./TextEditor";
// Handlers
import { PlayPauseButton } from "./handlers/playerHandler.js";
import { TranscribeButton } from "./handlers/transcriptHandler";

const TextToSpeech = () => {
  return (
    <Container>
      <h3 className="feature-title">
        <i className="fa-solid fa-feather-pointed"></i> Text to Speech
      </h3>
      <Row className="justify-content-center mt-3">
        <TextEditor placeholder="Enter text here" />
      </Row>
      <Row className="justify-content-center">
        <div className="tts-buttons-container">
          <div className="tts-controls-container">
            <PlayPauseButton />
            <button>
              <i className="fa-solid fa-delete-left"></i>
            </button>
            <button style={{ width: "auto" }}>Import</button>
          </div>
          <TranscribeButton />
        </div>
      </Row>
    </Container>
  );
};

export default TextToSpeech;
