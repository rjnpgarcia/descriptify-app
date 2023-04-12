import React, { useCallback, useEffect, useRef, useState } from "react";
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
  transcribeSTT,
} from "../handlers/transcriptHandler.js";
import {
  PlayPauseButton,
  playAudio,
  pauseAudio,
} from "../handlers/playerHandler.js";
import Waveform from "./Waveform";
import OverdubModal from "../layouts/OverdubModal";

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [transcriptWithTS, setTranscriptWithTS] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showOverdub, setShowOverdub] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const { setDataTranscript } = useDownload();
  const [waveform, setWaveform] = useState(null);
  const [highlight, setHighlight] = useState("");
  const [selectedWord, setSelectedWord] = useState("");
  const [changes, setChanges] = useState(false);

  useEffect(() => {
    if (changes) {
      transcribeSTT(
        audio,
        setIsLoading,
        setTranscriptWithTS,
        setDataTranscript
      );
      setChanges(false);
    }
  }, [changes, audio, setDataTranscript]);

  // Handle Modal pop-up for recording audio
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  // Handle Modal pop-up for remove audio and text
  const handleCloseRemove = () => setShowRemove(false);
  const handleShowRemove = () => setShowRemove(true);
  // Handle Modal pop-up for Overdub
  const handleCloseOverdub = () => setShowOverdub(false);

  const handleShowOverdub = useCallback((word) => {
    setSelectedWord(word);
    console.log(word);
    setShowOverdub(true);
  }, []);

  // Set MediaRecorder API then start recording
  const handleStartRecording = async () => {
    setIsRecording(true);
    await startRecording(mediaRecorder, setAudioChunks);
  };

  // Stop recording and set Blob URL
  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording(mediaRecorder, audioChunks, setAudio, setAudioChunks);
    setTranscriptWithTS("");
    handleClose();
  };

  // Handle STT Transcription to server
  const handleTranscribe = async () => {
    // e.preventDefault();
    await transcribeSTT(
      audio,
      setIsLoading,
      setTranscriptWithTS,
      setDataTranscript
    );
    console.log(audio);
    console.log("Transcribing Audio");
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
    if (file) {
      setAudio(URL.createObjectURL(file));
      setTranscriptWithTS("");
    }
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
                      onClick={() =>
                        (!word.startTime && !word.endTime) || isLoading
                          ? ""
                          : handleShowOverdub(word)
                      }
                      key={index}
                      className={
                        highlight === word
                          ? "stt-word-highlight stt-word"
                          : "stt-word"
                      }
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
          handleShowOverdub={handleShowOverdub}
          isLoading={isLoading}
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
                disabled={!audio && !transcriptWithTS}
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
      <OverdubModal
        word={selectedWord}
        show={showOverdub}
        onHide={handleCloseOverdub}
        audio={audio}
        setAudio={setAudio}
        transcriptWithTS={transcriptWithTS}
        setTranscriptWithTS={setTranscriptWithTS}
        setChanges={setChanges}
      />
    </>
  );
};

export default SpeechToText;
