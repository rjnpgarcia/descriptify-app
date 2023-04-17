import React from "react";
import "./handlersCSS/transcriptHandler.css";

// Handle Speech-to-text Transcription to Server
export const transcribeSTT = async (
  audio,
  setIsLoading,
  setTranscriptWithTS
) => {
  try {
    setIsLoading(true);
    const formData = new FormData();
    const res = await fetch(audio.present);
    const audioBlob = await res.blob();
    console.log(audioBlob);
    formData.append("audioFile", audioBlob, "audio.mp3");
    const response = await fetch("http://localhost:8000/api/speechtotext", {
      method: "POST",
      body: formData,
    });
    console.log(formData);
    const data = await response.json();
    console.log(data);
    // Transcription received by object
    if (response.ok) {
      const words = data;
      await setTranscriptWithTS(words);
    }
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
  setIsLoading
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
    if (response.ok) {
      const audioUrl = URL.createObjectURL(audioBlob);

      console.log(audioBlob);
      setAudio(audioUrl);
    }
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
