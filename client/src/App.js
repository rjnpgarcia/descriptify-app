import React from "react";
import "./App.css";
import SpeechToText from "./components/SpeechToText";
import TextEditor from "./components/TextEditor";
import TextToSpeech from "./components/TextToSpeech";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Descriptify App</h1>
      </header>
      <main>
        <section>
          <div className="stt-container">
            <h2>Speech to Text</h2>
            <TextEditor placeholder="This is where the transcription will be displayed" />
            <SpeechToText />
          </div>
        </section>
        <section>
          <div className="tts-container">
            <h2>Text to Speech</h2>
            <TextEditor placeholder="Type text here" />
            <TextToSpeech />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
