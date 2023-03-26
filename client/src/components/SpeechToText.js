import React, { useRef, useState } from "react";
// Components
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import "./componentsCSS/SpeechToText.css";
import TextEditor from "./TextEditor.js";
import RecordModal from "../layouts/RecordModal.js";
// Handlers
import { startRecording, stopRecording } from "../handlers/audioHandler.js";
import {
  TranscribeButton,
  transcribeSTT,
} from "../handlers/transcriptHandler.js";
import {
  PlayPauseButton,
  playAudio,
  pauseAudio,
} from "../handlers/playerHandler.js";

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const mimeType = "audio/mp3";

  // Handle Modal pop-up for recording audio
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // Set MediaRecorder API then start recording
  const handleStartRecording = async () => {
    setIsRecording(true);
    startRecording(mediaRecorder, setAudioChunks, mimeType);
  };

  // Stop recording and set Blob URL
  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording(
      mediaRecorder,
      audioChunks,
      setAudio,
      setAudioChunks,
      mimeType
    );
    handleClose();
  };

  // Handle STT Transcription to server
  const handleTranscribe = async (e) => {
    e.preventDefault();
    transcribeSTT(audio, setIsLoading, setTranscript);
  };

  // Handle audio player controls
  const audioPlayer = document.getElementById("stt-audio-player");
  const handlePlayAudio = () => {
    playAudio(audioPlayer, setIsPlaying);
  };
  const handlePauseAudio = () => {
    pauseAudio(audioPlayer, isPlaying, setIsPlaying);
  };

  // Handle onChange for textEditor
  const handleChange = (e) => {
    setTranscript(e.target.value);
  };

  // Handle Remove/Replace recorded audio
  const handleRemoveAudioText = () => {
    setAudio(null);
    setTranscript("");
    console.log("Removed Audio and Transcript");
  };
  const handleReplaceAudio = () => {
    setAudio(null);
    setShowModal(true);
    console.log("Removed Audio and start recording again");
  };

  return (
    <>
      <Container>
        <h3 className="feature-title">
          <i className="fa-solid fa-microphone"></i> Speech to Text
        </h3>
        <Row className="justify-content-center mt-3">
          <TextEditor
            transcript={transcript}
            handler={handleChange}
            placeholder="This is where the transcription will be stored"
          />
        </Row>
        <Row className="justify-content-center">
          <div className="stt-buttons-container">
            <audio id="stt-audio-player" src={audio}></audio>
            <div className="stt-controls-container">
              <PlayPauseButton
                isPlaying={isPlaying}
                audio={audio}
                play={handlePlayAudio}
                pause={handlePauseAudio}
              />
              <button className="record-button" onClick={handleShow}>
                <i
                  className="fa-solid fa-microphone"
                  style={{ color: "#e20808" }}
                ></i>
              </button>
              <button onClick={handleRemoveAudioText}>
                <i className="fa-solid fa-delete-left"></i>
              </button>
              <button
                className="replace-button"
                onClick={handleReplaceAudio}
                disabled={!audio}
              >
                <i className="fa-solid fa-rotate"></i>
              </button>
              <button style={{ width: "auto" }}>Import</button>
            </div>
            <TranscribeButton
              isLoading={isLoading}
              transcribe={handleTranscribe}
              data={audio}
            />
          </div>
        </Row>
      </Container>
      <RecordModal
        show={showModal}
        onHide={handleClose}
        stopRecording={handleStopRecording}
        startRecording={handleStartRecording}
        isRecording={isRecording}
      />
    </>
  );
};

export default SpeechToText;
