import React, { useRef, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";
import "./componentsCSS/TextToSpeech.css";
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
  const words = useRef([]);

  const handleTranscribe = async (e) => {
    e.preventDefault();
    // transcribeTTS(text, setAudio, setIsLoading);
    try {
      setIsLoading(true);
      words.current = [];
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

    // Split the text into an array of words
    words.current = text.split(" ");
    // setWords(text.split(" "));

    // Iterate over each word
    words.current.forEach((word, index) => {
      // Calculate the duration of the word
      // Adjust time to sync with the spoken words
      const durationPerWord = word.length * 100;
      const durationToNextWord = 300;

      // Highlight the word after a delay
      setTimeout(() => {
        const spans = document.querySelectorAll(`span[data-index="${index}"]`);
        spans.forEach((span) => span.classList.add("word-highlight"));
      }, index * durationToNextWord);

      // Remove the highlight after the word has finished
      setTimeout(() => {
        const spans = document.querySelectorAll(`span[data-index="${index}"]`);
        spans.forEach((span) => span.classList.remove("word-highlight"));
      }, index * durationToNextWord + durationPerWord);
    });

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
        <Col xs="6">
          <textarea
            className="tts-textarea"
            rows="13"
            cols="42"
            placeholder="Enter text here for transcription"
            value={text}
            onChange={handleChange}
          />
        </Col>
        <Col xs="6">
          <div className="tts-output">
            <p className="tts-text-output">
              {/* word <span className="word-highlight">highlight</span> text here */}
              {words.current.map((word, index) => (
                <span key={index} data-index={index}>
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>
        </Col>
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
