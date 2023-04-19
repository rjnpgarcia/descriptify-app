import React from "react";
import "./handlersCSS/playerHandler.css";

// Play audio
export const playAudio = (audioPlayer, setIsPlaying) => {
  audioPlayer.play();
  setIsPlaying(true);
  audioPlayer.onended = () => {
    setIsPlaying(false);
  };
};

// Pause audio
export const pauseAudio = (audioPlayer, isPlaying, setIsPlaying) => {
  if (isPlaying) {
    audioPlayer.pause();
    setIsPlaying(false);
  }
};

// Play & Pause Button handler
export const PlayPauseButton = ({ isPlaying, audio, play, pause }) => {
  return (
    <>
      {!isPlaying ? (
        <button
          className="play-button"
          onClick={play}
          disabled={!audio.present}
        >
          {audio.present ? (
            <i className="fa-solid fa-play" style={{ color: "#8a93e2" }}></i>
          ) : (
            <i className="fa-solid fa-play"></i>
          )}
        </button>
      ) : (
        <button onClick={pause}>
          <i className="fa-solid fa-pause"></i>
        </button>
      )}
    </>
  );
};
