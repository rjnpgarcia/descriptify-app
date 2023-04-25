import React, { useCallback, useEffect, useRef, useState } from "react";
import useUndo from "use-undo";
// Bootstrap
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";
// Components
import "./componentsCSS/SpeechToText.css";
import RecordModal from "../layouts/RecordModal.js";
import DeleteModal from "../layouts/DeleteModal";
import Waveform from "./Waveform";
import OverdubModal from "../layouts/OverdubModal";
// Handlers
import { useDownload } from "../contexts/DownloadHandler";
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
import { useLoading } from "../contexts/ScreenLoaderHandler";
import { useFile } from "../contexts/FileHandler";

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showOverdub, setShowOverdub] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const fileInputRef = useRef(null);
  const { setDataDownload } = useDownload();
  const { setLoadingScreen } = useLoading();
  const { getFile, setSaveFile, setGetFile, setOverwriteFile } = useFile();
  const [fileData, setFileData] = useState({});
  const [waveform, setWaveform] = useState(null);
  const [highlight, setHighlight] = useState("");
  const [selectedWord, setSelectedWord] = useState("");
  const [changes, setChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [
    audio,
    {
      set: setAudio,
      undo: handleUndoAudio,
      redo: handleRedoAudio,
      canUndo: canUndoAudio,
      canRedo: canRedoAudio,
    },
  ] = useUndo(null);
  const [
    transcriptWithTS,
    {
      set: setTranscriptWithTS,
      undo: handleUndoTranscript,
      redo: handleRedoTranscript,
      canUndo: canUndoTranscript,
      canRedo: canRedoTranscript,
    },
  ] = useUndo("");

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  }, [errorMessage]);

  useEffect(() => {
    setOverwriteFile({});
  }, [setOverwriteFile]);

  useEffect(() => {
    // For full screen loading
    if (changes) {
      setLoadingScreen(true);
      transcribeSTT(audio, setIsLoading, setTranscriptWithTS, setErrorMessage)
        .then(() => setChanges(false))
        .then(() => setLoadingScreen(false));
      if (fileData.name && fileData.id) {
        setOverwriteFile(fileData);
      }
    } else {
      setLoadingScreen(false);
      setChanges(false);
    }
  }, [
    changes,
    audio,
    setTranscriptWithTS,
    setLoadingScreen,
    fileData,
    setOverwriteFile,
  ]);

  useEffect(() => {
    // For save file and download files setting
    setSaveFile({
      stt: true,
      audio: audio.present,
      transcript: transcriptWithTS.present,
    });
    const words = transcriptWithTS.present;
    if (words) {
      const transcriptText = words.map((w) => w.word).join("");
      setDataDownload({
        audio: audio.present,
        transcript: transcriptText,
      });
    } else {
      setDataDownload({
        audio: audio.present,
        transcript: "",
      });
    }
  }, [audio.present, transcriptWithTS.present, setSaveFile, setDataDownload]);

  useEffect(() => {
    if (getFile && getFile.name && getFile.id && getFile.type) {
      const transcriptOpen = JSON.parse(getFile.transcript);
      const getAudio = async (audioFile, setAudio, id, type) => {
        const response = await fetch(
          `/api/getaudio/${id}/${type}/${audioFile}`
        );
        const data = await response.blob();
        if (response.ok) {
          const audioUrl = URL.createObjectURL(data);
          setAudio(audioUrl);
        }
      };
      setTranscriptWithTS(transcriptOpen);
      getAudio(getFile.name, setAudio, getFile.id, getFile.type);
      setFileData({ name: getFile.name, id: getFile.id });
      setGetFile({});
    }
  }, [getFile, setTranscriptWithTS, setGetFile, setAudio]);

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
    setShowOverdub(true);
  }, []);

  // Set MediaRecorder API then start recording
  const handleStartRecording = async () => {
    setIsRecording(true);
    fileInputRef.current.value = "";
    // setAudio(null);
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
    setLoadingScreen(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    await transcribeSTT(
      audio,
      setIsLoading,
      setTranscriptWithTS,
      setErrorMessage
    );
    if (fileData.name && fileData.id) {
      setOverwriteFile(fileData);
    }
    setLoadingScreen(false);
  };

  // Handle audio player controls
  const handlePlayAudio = (e) => {
    e.preventDefault();
    playAudio(waveform, setIsPlaying);
    // For transcription word highlights synced with audio
    if (transcriptWithTS.present) {
      waveform.on("audioprocess", () => {
        // Current playing time of wavesurfer
        const currentTime = waveform.getCurrentTime();
        const highlightedWord = transcriptWithTS.present.find((word) => {
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
  };

  // Handle Remove/Replace recorded audio
  const handleRemoveAudioText = () => {
    if (isPlaying) {
      setIsPlaying(false);
    }
    setAudio(null);
    setTranscriptWithTS("");
    fileInputRef.current.value = "";
    setFileData({});
    setOverwriteFile({});
    setShowRemove(false);
  };

  // Audio file import to transcription
  const handleAudioImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudio(URL.createObjectURL(file));
      setTranscriptWithTS("");
    }
  };

  const handleUndoSTT = () => {
    handleUndoAudio();
    handleUndoTranscript();
  };
  const handleRedoSTT = () => {
    handleRedoAudio();
    handleRedoTranscript();
  };

  return (
    <>
      <Container>
        <Row>
          <Col xs="6" className="align-self-center">
            <h3 className="feature-title">
              <i className="fa-solid fa-microphone"></i> Speech to Text
            </h3>
          </Col>
          <Col xs="6" className="align-self-center text-end">
            <button
              className={
                canUndoAudio && canUndoTranscript
                  ? "undo-redo-button"
                  : "undo-redo-button text-secondary"
              }
              onClick={handleUndoSTT}
              disabled={!canUndoAudio || !canUndoTranscript ? true : false}
            >
              <i className="fa-sharp fa-solid fa-rotate-left"></i>
            </button>
            <button
              className={
                canRedoAudio && canRedoTranscript
                  ? "undo-redo-button"
                  : "undo-redo-button text-secondary"
              }
              onClick={handleRedoSTT}
              disabled={!canRedoAudio || !canRedoTranscript ? true : false}
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </Col>
        </Row>
        {errorMessage ? (
          <p className="text-danger m-0 text-center">{errorMessage}</p>
        ) : (
          ""
        )}
        <Row className="justify-content-center mt-2">
          <div id="transcription-output">
            {transcriptWithTS.present ? (
              <p className="stt-text-output">
                {transcriptWithTS.present.map((word, index) => {
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
                disabled={!audio.present && !transcriptWithTS.present}
              >
                <i className="fa-solid fa-delete-left"></i>
              </button>
            </div>
            <input
              className="form-control form-control-sm import-file-input"
              type="file"
              accept="audio/mp3, audio/wav, audio/aac, audio/x-m4a"
              onChange={handleAudioImport}
              ref={fileInputRef}
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
        setChanges={setChanges}
      />
    </>
  );
};

export default SpeechToText;
