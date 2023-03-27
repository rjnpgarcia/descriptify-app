import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import "./componentsCSS/TextToSpeech.css";
// Components
import TextEditor from "./TextEditor";
// Handlers
import {
  PlayPauseButton,
  playAudio,
  pauseAudio,
} from "../handlers/playerHandler.js";
import { transcribeTTS, TranscribeButton } from "../handlers/transcriptHandler";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTranscribe = async (e) => {
    e.preventDefault();
    // transcribeTTS(text, setAudio, setIsLoading);
    try {
      setIsLoading(true);
      console.log(text);
      const response = await fetch("http://localhost:8000/api/texttospeech", {
        method: "POST",
        headers: {
          "Content-type": "text/plain",
        },
        body: text,
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      console.log(audioBlob);
      setAudio(audioUrl);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // Handle audio player controls
  const audioPlayerTTS = document.getElementById("tts-audio-player");
  const handlePlayAudio = () => {
    // playAudio(audioPlayerTTS, setIsPlaying);
    console.log("Pressed Play Audio");
    audioPlayerTTS.play();
    setIsPlaying(true);
    audioPlayerTTS.onended = () => {
      setIsPlaying(false);
      setText(text);
    };
  };
  const handlePauseAudio = () => {
    pauseAudio(audioPlayerTTS, isPlaying, setIsPlaying);
  };

  // Handle onChange for textEditor
  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <Container>
      <h3 className="feature-title">
        <i className="fa-solid fa-feather-pointed"></i> Text to Speech
      </h3>
      <Row className="justify-content-center mt-3">
        {!isPlaying ? (
          <TextEditor
            placeholder="Enter text here to transcribe"
            transcript={text}
            handler={handleChange}
          />
        ) : (
          <p>{text}</p>
        )}
      </Row>
      <Row className="justify-content-center">
        <div className="tts-buttons-container">
          <audio id="tts-audio-player" src={audio}></audio>
          <div className="tts-controls-container">
            <PlayPauseButton
              isPlaying={isPlaying}
              audio={audio}
              play={handlePlayAudio}
              pause={handlePauseAudio}
            />
            <button>
              <i className="fa-solid fa-delete-left"></i>
            </button>
            <button style={{ width: "auto" }}>Import</button>
          </div>
          <TranscribeButton
            isLoading={isLoading}
            transcribe={handleTranscribe}
            data={text}
          />
        </div>
      </Row>
    </Container>
  );
};

export default TextToSpeech;
