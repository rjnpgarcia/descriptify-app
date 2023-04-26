import React, { useRef, useState, useEffect } from "react";
import useUndo from "use-undo";
// Bootstrap
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";
// Components
import DeleteModal from "../layouts/DeleteModal";
// Handlers
import { transcribeTTS, TranscribeButton } from "../handlers/transcriptHandler";
import { useDownload } from "../contexts/DownloadHandler";
import { useFile } from "../contexts/FileHandler";
// CSS
import "./componentsCSS/TextToSpeech.css";
import { useLoading } from "../contexts/ScreenLoaderHandler";

const TextToSpeech = () => {
  const [audio, setAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileData, setFileData] = useState({});
  const words = useRef([]);
  const text = useRef("");
  const fileInputTTSRef = useRef(null);
  const { setDataDownload } = useDownload();
  const { setLoadingScreen } = useLoading();
  const { getFile, setSaveFile, setGetFile, setOverwriteFile } = useFile();
  const [
    newText,
    {
      set: setNewText,
      undo: handleUndo,
      redo: handleRedo,
      canUndo,
      canRedo,
      reset: resetNewText,
    },
  ] = useUndo("");

  useEffect(() => {
    setOverwriteFile({});
  }, [setOverwriteFile]);

  useEffect(() => {
    setSaveFile({
      tts: true,
      audio: audio,
      transcript: newText.present,
    });
    setDataDownload({
      audio: audio,
      transcript: newText.present,
    });
  }, [audio, newText.present, setSaveFile, setDataDownload]);

  useEffect(() => {
    if (getFile && getFile.name && getFile.id && getFile.type) {
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
      resetNewText(getFile.transcript);
      words.current = [];
      text.current = getFile.transcript;
      getAudio(getFile.name, setAudio, getFile.id, getFile.type);
      setFileData({ name: getFile.name, id: getFile.id });
      setGetFile({});
    }
  }, [getFile, resetNewText, setGetFile]);

  // Text-to-Speech Handler
  const handleTranscribe = async (e) => {
    e.preventDefault();
    setLoadingScreen(true);
    await transcribeTTS(text, words, newText, setAudio, setIsLoading);
    if (fileInputTTSRef.current) {
      fileInputTTSRef.current.value = "";
    }
    if (fileData.name && fileData.id) {
      setOverwriteFile(fileData);
    }
    setLoadingScreen(false);
  };

  // Handle audio player controls and output
  const audioPlayer = document.querySelector("#tts-audio-player");
  const handlePlayOutput = () => {
    // Split the text into an array of words
    words.current = text.current.split(" ");

    const utterance = new SpeechSynthesisUtterance(text.current);
    utterance.rate = 1.2;
    utterance.volume = 0;

    let currentWordIndex = 0;
    utterance.addEventListener("boundary", (e) => {
      if (e.name === "word") {
        const wordIndex = currentWordIndex;
        currentWordIndex++;
        const span = document.querySelector(`span[data-index="${wordIndex}"]`);
        span.classList.add("word-highlight");

        setTimeout(() => {
          span.classList.remove("word-highlight");
        }, 300);
      }
    });
    // Play audio handler
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      audioPlayer.play();
    } else {
      window.speechSynthesis.speak(utterance);
      audioPlayer.play();
    }
    setIsPlaying(true);

    utterance.onend = () => {
      setIsPlaying(false);
    };
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    setIsPlaying(false);
  };

  // Clear Audio transcription, Output and input text
  const handleClear = () => {
    if (isPlaying) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      setIsPlaying(false);
    }
    setAudio(null);
    setNewText("");
    words.current = [];
    if (fileInputTTSRef.current) {
      fileInputTTSRef.current.value = "";
    }
    setFileData({});
    setOverwriteFile({});
    setShowDeleteModal(false);
  };

  // Text file import to speech
  const handleTextImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewText(e.target.result);
    };
    reader.readAsText(file);
  };

  // DeleteModal handlers
  const handleShowDelete = () => {
    setShowDeleteModal(true);
  };
  const handleRemoveDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <Container>
      <Row>
        <Col xs="6" md="5" className="align-self-center">
          <h3 className="feature-title">
            <i className="fa-solid fa-feather-pointed"></i> Text to Speech
          </h3>
        </Col>
        <Col xs="6" md="2">
          <button
            className={
              canUndo ? "undo-redo-button" : "undo-redo-button text-secondary"
            }
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <i className="fa-sharp fa-solid fa-rotate-left"></i>
          </button>
          <button
            className={
              canRedo ? "undo-redo-button" : "undo-redo-button text-secondary"
            }
            onClick={handleRedo}
            disabled={!canRedo}
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </Col>
      </Row>
      <Row className="justify-content-center mt-1">
        <Col xs="12" md="6">
          <textarea
            className="tts-textarea"
            rows="13"
            cols="42"
            placeholder="Enter text here for transcription"
            value={newText.present}
            onChange={(e) => setNewText(e.target.value)}
          />
        </Col>
        <Col xs="12" md="6">
          <div className="tts-output">
            <p className="tts-text-output">
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
            {!isPlaying ? (
              <button
                className="play-button"
                onClick={handlePlayOutput}
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
              <button onClick={handleStop}>
                <i className="fa-solid fa-stop"></i>
              </button>
            )}
            <button onClick={handleShowDelete}>
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
          <input
            className="form-control form-control-sm import-file-input"
            type="file"
            accept="text/plain"
            onChange={handleTextImport}
            ref={fileInputTTSRef}
          />
          <TranscribeButton
            isLoading={isLoading}
            transcribe={handleTranscribe}
            data={newText}
          />
        </div>
      </Row>
      <DeleteModal
        show={showDeleteModal}
        onHide={handleRemoveDelete}
        handler={handleClear}
      />
    </Container>
  );
};

export default TextToSpeech;
