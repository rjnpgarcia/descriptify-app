import React, { useRef, useState } from "react";
// Components
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import "./componentsCSS/SpeechToText.css";
import TextEditor from "./TextEditor.js";
import RecordModal from "../layouts/RecordModal.js";
import LoadingTranscript from "../layouts/LoadingTranscript.js";

const SpeechToText = () => {
  const mediaRecorder = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mimeType = "audio/mp3";

  // Handle Modal pop-up for recording audio
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // Set MediaRecorder API then start recording
  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      console.log("Start Recording");
      // To check if MediaRecorder is supported by browser
      if ("MediaRecorder" in window) {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        const media = new MediaRecorder(streamData, { type: mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (e) => {
          if (typeof e.data === "undefined") return;
          if (e.data.size === 0) return;
          localAudioChunks.push(e.data);
        };
        setAudioChunks(localAudioChunks);
      } else {
        alert("The MediaRecorder API is not supported in your browser");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Stop recording and set Blob URL
  const handleStopRecording = () => {
    setIsRecording(false);
    console.log("Stop Recording");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log(audioUrl);
      setAudio(audioUrl);
      setAudioChunks([]);
      handleClose();
    };
  };

  // Handle Transcription to server
  const handleTranscribe = async (e) => {
    e.preventDefault();
    console.log("Transcribing Audio");
    console.log(audio);
    try {
      setIsLoading(true);
      const formData = new FormData();
      const res = await fetch(audio);
      const audioBlob = await res.blob();
      console.log(audioBlob);
      formData.append("audioFile", audioBlob, "audio.mp3");
      const response = await fetch("http://localhost:8000/api/transcribestt", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setIsLoading(false);
      // Transcription received by object
      setTranscript(data.monologues[0].elements.map((e) => e.value).join(""));
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    }
  };

  // Handle audio player controls
  const audioPlayer = document.getElementById("stt-audio-player");
  const handlePlayAudio = () => {
    console.log("Pressed Play Audio");
    audioPlayer.play();
    setIsPlaying(true);
  };
  const handlePauseAudio = () => {
    console.log("Paused Audio");
    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  // Handle onChange for textEditor
  const handleChange = (e) => {
    setTranscript(e.target.value);
  };

  // Handle Remove/Replace recorded audio
  const handleRemoveAudioText = () => {
    setAudio(null);
    setTranscript("");
  };
  const handleReplaceAudio = () => {
    setAudio(null);
    setShowModal(true);
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
              {!isPlaying ? (
                <button
                  className="stt-play-button"
                  onClick={handlePlayAudio}
                  disabled={!audio}
                >
                  {audio ? (
                    <i
                      className="fa-solid fa-play"
                      style={{ color: "#8a93e2" }}
                    ></i>
                  ) : (
                    <i className="fa-solid fa-play"></i>
                  )}
                </button>
              ) : (
                <button className="stt-pause-button" onClick={handlePauseAudio}>
                  <i class="fa-solid fa-pause"></i>
                </button>
              )}
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
            <div className="stt-transcribe-container">
              {!isLoading ? (
                <button
                  className="stt-transcribe-button"
                  onClick={handleTranscribe}
                  disabled={!audio}
                >
                  Transcribe
                </button>
              ) : (
                <LoadingTranscript />
              )}
            </div>
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
