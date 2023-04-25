import React from "react";
import "./handlersCSS/transcriptHandler.css";

// Handle Speech-to-text Transcription to Server
export const transcribeSTT = async (
  audio,
  setIsLoading,
  setTranscriptWithTS,
  setErrorMessage
) => {
  try {
    setIsLoading(true);
    const formData = new FormData();
    const res = await fetch(audio.present);
    const audioBlob = await res.blob();
    formData.append("audioFile", audioBlob, "audio.mp3");
    const response = await fetch("/api/speechtotext", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    // Transcription received by object
    if (data.success) {
      const words = data.success;
      await setTranscriptWithTS(words);
    } else if (data.error) {
      setErrorMessage(data.error);
    }
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    setErrorMessage("Transcription failed. Please try again.");
  }
};

// Handle Text-to-Speech Transcription to Server
export const transcribeTTS = async (
  text,
  words,
  newText,
  setAudio,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    words.current = [];
    text.current = newText.present;
    const response = await fetch("/api/texttospeech", {
      method: "POST",
      headers: {
        "Content-type": "text/plain",
      },
      body: text.current,
    });

    const audioBlob = await response.blob();
    if (response.ok) {
      const audioUrl = URL.createObjectURL(audioBlob);

      setAudio(audioUrl);
    }
    setIsLoading(false);
  } catch (error) {
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
          disabled={!data.present}
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
