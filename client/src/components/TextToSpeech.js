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

const TextToSpeech = () => {
  const [audio, setAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const words = useRef([]);
  const text = useRef("");
  const { setDataDownload } = useDownload();
  const { getFile, setSaveFile, setGetFile } = useFile();
  const [
    newText,
    { set: setNewText, undo: handleUndo, redo: handleRedo, canUndo, canRedo },
  ] = useUndo("");

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
    console.log(getFile);

    if (getFile && getFile.name && getFile.id && getFile.type) {
      const getAudio = async (audioFile, setAudio, id, type) => {
        const response = await fetch(
          `http://localhost:8000/api/getaudio/${id}/${type}/${audioFile}`
        );
        const data = await response.blob();
        if (response.ok) {
          const audioUrl = URL.createObjectURL(data);
          setAudio(audioUrl);
        }
      };
      setNewText(getFile.transcript);
      words.current = [];
      text.current = getFile.transcript;
      getAudio(getFile.name, setAudio, getFile.id, getFile.type);
      setGetFile({});
    }
  }, [getFile, setNewText, setGetFile]);

  // Text-to-Speech Handler
  const handleTranscribe = async (e) => {
    e.preventDefault();
    transcribeTTS(text, words, newText, setAudio, setIsLoading);
  };

  // Handle audio player controls and output
  const audioPlayerTTS = document.getElementById("tts-audio-player");
  const handlePlayOutput = () => {
    // Split the text into an array of words
    words.current = text.current.split(" ");

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

    // Play audio handler
    console.log("Pressed Play Audio");
    audioPlayerTTS.play();
    setIsPlaying(true);
    audioPlayerTTS.onended = () => {
      setIsPlaying(false);
    };
  };

  // Clear Audio transcription, Output and input text
  const handleClear = () => {
    setAudio(null);
    setNewText("");
    words.current = [];
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
        <Col xs="5" className="align-self-center">
          <h3 className="feature-title">
            <i className="fa-solid fa-feather-pointed"></i> Text to Speech
          </h3>
        </Col>
        <Col xs="2">
          <button
            className="undo-redo-button"
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <i className="fa-sharp fa-solid fa-rotate-left"></i>
          </button>
          <button
            className="undo-redo-button"
            onClick={handleRedo}
            disabled={!canRedo}
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </Col>
      </Row>
      <Row className="justify-content-center mt-1">
        <Col xs="6">
          <textarea
            className="tts-textarea"
            rows="13"
            cols="42"
            placeholder="Enter text here for transcription"
            value={newText.present}
            onChange={(e) => setNewText(e.target.value)}
          />
        </Col>
        <Col xs="6">
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
            <button
              className="play-button"
              onClick={handlePlayOutput}
              disabled={!audio || isPlaying}
            >
              {!isPlaying && audio ? (
                <i
                  className="fa-solid fa-play"
                  style={{ color: "#8a93e2" }}
                ></i>
              ) : (
                <i className="fa-solid fa-play"></i>
              )}
            </button>
            <button onClick={handleShowDelete}>
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
          <input
            className="form-control form-control-sm import-file-input"
            type="file"
            accept="text/plain"
            onChange={handleTextImport}
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
