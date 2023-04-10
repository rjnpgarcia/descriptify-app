import React from "react";
import "./handlersCSS/transcriptHandler.css";

// Handle Speech-to-text Transcription to Server
export const transcribeSTT = async (
  audio,
  setIsLoading,
  setTranscriptWithTS,
  setDataTranscript
) => {
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
    // Transcription received by object
    const words = data;
    const transcriptText = await words.map((w) => w.word).join("");
    await setTranscriptWithTS(words);
    await setDataTranscript(transcriptText);
    setIsLoading(false);
    console.log("Successful! Transcribed Audio");
  } catch (error) {
    setIsLoading(false);
    console.error(error.message);
  }
};

// Handle Text-to-Speech Transcription to Server
export const transcribeTTS = async (
  text,
  words,
  newText,
  setAudio,
  setIsLoading,
  setDataAudio
) => {
  try {
    setIsLoading(true);
    words.current = [];
    text.current = newText.present;
    console.log(text);
    const response = await fetch("http://localhost:8000/api/texttospeech", {
      method: "POST",
      headers: {
        "Content-type": "text/plain",
      },
      body: text.current,
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    console.log(audioBlob);
    setAudio(audioUrl);
    setDataAudio(audioBlob);
    setIsLoading(false);
  } catch (error) {
    console.log(error);
    setIsLoading(false);
  }
};

export const TranscribeButton = ({ isLoading, transcribe, data }) => {
  return (
    <>
      {!isLoading ? (
        <button
          className="transcribe-button"
          onClick={transcribe}
          disabled={!data}
        >
          Transcribe
        </button>
      ) : (
        <button className="loading-transcription" disabled>
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <span>Transcribing. . . . .</span>
        </button>
      )}
    </>
  );
};
