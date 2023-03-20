import React, { useEffect, useRef, useState } from "react";
// Components
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import "./componentsCSS/SpeechToText.css";
import TextEditor from "./TextEditor.js";

const SpeechToText = () => {
  const mediaRecorder = useRef(null);
  const [isRecording, setIsRecording] = useState("inactive");
  // const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [transcript, setTranscript] = useState("");

  const mimeType = "audio/mp3";

  const handleStartRecording = async () => {
    try {
      setIsRecording("recording");
      console.log("Start Recording");
      if ("MediaRecorder" in window) {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        // setStream(streamData);

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

  const handleStopRecording = () => {
    setIsRecording("inactive");
    console.log("Stop Recording");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log(audioUrl);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const handleTranscribe = async (e) => {
    e.preventDefault();
    console.log("Transcribing Audio");
    console.log(audio);
    const formData = new FormData();
    const audioBlobUrl = await fetch(audio).then((res) => res.blob());
    console.log(audioBlobUrl);
    formData.append("audioFile", audioBlobUrl);
    const response = await fetch("http://localhost:8000/api/transcribestt", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    setTranscript(data.monologues[0].elements.map((e) => e.value).join(" "));
  };

  // Play recorded audio using button tag
  const handlePlayAudio = () => {
    console.log("Pressed Play Audio");
    const audioFile = new Audio(audio);
    audioFile.play();
  };

  const handleChange = (e) => {
    setTranscript(e.target.value);
  };

  return (
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
          <div className="stt-controls-container">
            <button className="stt-play-button" onClick={handlePlayAudio}>
              <i className="fa-solid fa-play" style={{ color: "#05a705" }}></i>
            </button>
            {/* {isRecording ? ( */}
            <button>
              <i className="fa-solid fa-stop" onClick={handleStopRecording}></i>
            </button>
            {/* ) : ( */}
            <button className="record-button" onClick={handleStartRecording}>
              <i
                className="fa-solid fa-microphone"
                style={{ color: "#e20808" }}
              ></i>
            </button>
            {/* )} */}
            <button>
              <i className="fa-solid fa-rotate"></i>
            </button>
            <button>
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
          <div className="stt-import-container">
            <button onClick={handleTranscribe}>Transcribe</button>
          </div>
          <div className="stt-import-container">
            <button>Import Audio</button>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default SpeechToText;
