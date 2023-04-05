import React, { useRef, useState } from "react";
import { useDownload } from "../contexts/DownloadHandler";
// Components
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import "./componentsCSS/SpeechToText.css";
import RecordModal from "../layouts/RecordModal.js";
import DeleteModal from "../layouts/DeleteModal";
// Handlers
import { startRecording, stopRecording } from "../handlers/audioHandler.js";
import {
  TranscribeButton,
  // transcribeSTT,
} from "../handlers/transcriptHandler.js";
import {
  PlayPauseButton,
  playAudio,
  pauseAudio,
} from "../handlers/playerHandler.js";
import Waveform from "./Waveform";

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [transcriptWithTS, setTranscriptWithTS] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const { setDataTranscript } = useDownload();
  const [waveform, setWaveform] = useState(null);
  const [highlight, setHighlight] = useState("");

  // Handle Modal pop-up for recording audio
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  // Handle Modal pop-up for remove audio and text
  const handleCloseRemove = () => setShowRemove(false);
  const handleShowRemove = () => setShowRemove(true);

  // Set MediaRecorder API then start recording
  const handleStartRecording = async () => {
    setIsRecording(true);
    startRecording(mediaRecorder, setAudioChunks);
  };

  // Stop recording and set Blob URL
  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording(mediaRecorder, audioChunks, setAudio, setAudioChunks);
    handleClose();
  };

  // Handle STT Transcription to server
  const handleTranscribe = async (e) => {
    e.preventDefault();
    // transcribeSTT(
    //   audio,
    //   setIsLoading,
    //   setTranscript,
    //   setTranscriptWithTS,
    //   setDataTranscript
    // );
    console.log(audio);
    console.log("Transcribing Audio");
    try {
      setIsLoading(true);
      const formData = new FormData();
      const res = await fetch(audio);
      const audioBlob = await res.blob();
      console.log(audioBlob);
      formData.append("audioFile", audioBlob, "audio.mp3");
      const response = await fetch("http://localhost:8000/api/speechtotext", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setIsLoading(false);
      // Transcription received by object
      const words = data;
      const transcriptText = words.map((w) => w.word).join("");
      setTranscript(transcriptText);
      setTranscriptWithTS(words);
      setDataTranscript(transcript);
      console.log("Successful! Transcribed Audio");
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    }
  };

  // Handle audio player controls
  const handlePlayAudio = (e) => {
    e.preventDefault();
    playAudio(waveform, setIsPlaying);
    // For transcription word highlights synced with audio
    if (transcriptWithTS) {
      waveform.on("audioprocess", () => {
        // Current playing time of wavesurfer
        const currentTime = waveform.getCurrentTime();
        const highlightedWord = transcriptWithTS.find((word) => {
          return currentTime >= word.startTime && currentTime <= word.endTime;
        });
        setHighlight(highlightedWord ? highlightedWord : "");
      });
    }
    waveform.on("finish", () => {
      setIsPlaying(false);
    });
  };
  const handlePauseAudio = () => {
    pauseAudio(waveform, isPlaying, setIsPlaying);
    console.log(highlight);
  };

  // Handle Remove/Replace recorded audio
  const handleRemoveAudioText = () => {
    setAudio(null);
    setTranscriptWithTS("");
    setShowRemove(false);
    console.log("Removed Audio and Transcript");
  };
  const handleReplaceAudio = () => {
    setAudio(null);
    setShowModal(true);
    console.log("Removed Audio and start recording again");
  };

  // Audio file import to transcription
  const handleAudioImport = (e) => {
    const file = e.target.files[0];
    setAudio(URL.createObjectURL(file));
  };

  return (
    <>
      <Container>
        <h3 className="feature-title">
          <i className="fa-solid fa-microphone"></i> Speech to Text
        </h3>
        <Row className="justify-content-center mt-2">
          <div id="transcription-output">
            {transcriptWithTS ? (
              <p className="stt-text-output">
                {transcriptWithTS.map((word, index) => {
                  return (
                    <span
                      onClick={() => console.log(`${word.word} is clicked`)}
                      key={index}
                      className={highlight === word ? "stt-word-highlight" : ""}
                    >
                      {word.word}
                    </span>
                  );
                })}
              </p>
            ) : (
              ""
            )}
          </div>
        </Row>
        <Waveform
          audio={audio}
          setWaveform={setWaveform}
          transcriptWithTS={transcriptWithTS}
        />
        <Row className="justify-content-center">
          <div className="stt-buttons-container">
            {/* <audio id="stt-audio-player" src={audio} ref={audioRef}></audio> */}
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
              <button
                className="remove-button"
                onClick={handleShowRemove}
                disabled={!audio && !transcript}
              >
                <i className="fa-solid fa-delete-left"></i>
              </button>
              <button
                className="replace-button"
                onClick={handleReplaceAudio}
                disabled={!audio}
              >
                <i className="fa-solid fa-rotate"></i>
              </button>
            </div>
            <input
              className="form-control form-control-sm import-file-input"
              type="file"
              accept="audio/mp3, audio/wav, audio/aac, audio/x-m4a"
              onChange={handleAudioImport}
            />
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
      <DeleteModal
        show={showRemove}
        onHide={handleCloseRemove}
        handler={handleRemoveAudioText}
      />
    </>
  );
};

export default SpeechToText;
