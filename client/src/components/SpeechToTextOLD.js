// import React, { useRef, useState } from "react";
// import { useDownload } from "../contexts/DownloadHandler";
// // Components
// import Container from "react-bootstrap/esm/Container";
// import Row from "react-bootstrap/esm/Row";
// import "./componentsCSS/SpeechToText.css";
// import RecordModal from "../layouts/RecordModal.js";
// import DeleteModal from "../layouts/DeleteModal";
// // Handlers
// import { startRecording, stopRecording } from "../handlers/audioHandler.js";
// import {
//   TranscribeButton,
//   transcribeSTT,
// } from "../handlers/transcriptHandler.js";
// import {
//   PlayPauseButton,
//   playAudio,
//   pauseAudio,
// } from "../handlers/playerHandler.js";

// const SpeechToText = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [audio, setAudio] = useState(null);
//   const [transcript, setTranscript] = useState("");
//   const [transcriptWithTS, setTranscriptWithTS] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [showRemove, setShowRemove] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const mediaRecorder = useRef(null);
//   // Download Transcript Context
//   const { setDataTranscript } = useDownload();

//   // Handle Modal pop-up for recording audio
//   const handleClose = () => setShowModal(false);
//   const handleShow = () => setShowModal(true);
//   // Handle Modal pop-up for remove audio and text
//   const handleCloseRemove = () => setShowRemove(false);
//   const handleShowRemove = () => setShowRemove(true);

//   // Set MediaRecorder API then start recording
//   const handleStartRecording = async () => {
//     setIsRecording(true);
//     startRecording(mediaRecorder, setAudioChunks);
//   };

//   // Stop recording and set Blob URL
//   const handleStopRecording = () => {
//     setIsRecording(false);
//     stopRecording(mediaRecorder, audioChunks, setAudio, setAudioChunks);
//     handleClose();
//   };

//   // Handle STT Transcription to server
//   const handleTranscribe = async (e) => {
//     e.preventDefault();
//     transcribeSTT(
//       audio,
//       setIsLoading,
//       setTranscript,
//       setTranscriptWithTS,
//       setDataTranscript
//     );
//   };

//   // Handle audio player controls
//   const audioPlayerSTT = document.getElementById("stt-audio-player");
//   const handlePlayAudio = () => {
//     playAudio(audioPlayerSTT, setIsPlaying);
//   };
//   const handlePauseAudio = () => {
//     pauseAudio(audioPlayerSTT, isPlaying, setIsPlaying);
//   };

//   // Handle onChange for textEditor
//   const handleChange = (e) => {
//     setTranscript(e.target.value);
//     // Can download edited transcription
//     setDataTranscript(e.target.value);
//   };

//   // Handle Remove/Replace recorded audio
//   const handleRemoveAudioText = () => {
//     setAudio(null);
//     setTranscript("");
//     setShowRemove(false);
//     console.log("Removed Audio and Transcript");
//   };
//   const handleReplaceAudio = () => {
//     setAudio(null);
//     setShowModal(true);
//     console.log("Removed Audio and start recording again");
//   };

//   // Audio file import to transcription
//   const handleAudioImport = (e) => {
//     const file = e.target.files[0];
//     setAudio(URL.createObjectURL(file));
//   };

//   return (
//     <>
//       <Container>
//         <h3 className="feature-title">
//           <i className="fa-solid fa-microphone"></i> Speech to Text
//         </h3>
//         <Row className="justify-content-center mt-2">
//           <textarea
//             className="stt-textarea"
//             rows="13"
//             cols="50"
//             placeholder="This is where the transcription will be stored"
//             value={transcript}
//             onChange={handleChange}
//           />
//         </Row>
//         <Row className="justify-content-center">
//           <div className="stt-buttons-container">
//             <audio id="stt-audio-player" src={audio}></audio>
//             <div className="stt-controls-container">
//               <PlayPauseButton
//                 isPlaying={isPlaying}
//                 audio={audio}
//                 play={handlePlayAudio}
//                 pause={handlePauseAudio}
//               />
//               <button className="record-button" onClick={handleShow}>
//                 <i
//                   className="fa-solid fa-microphone"
//                   style={{ color: "#e20808" }}
//                 ></i>
//               </button>
//               <button
//                 className="remove-button"
//                 onClick={handleShowRemove}
//                 disabled={!audio && !transcript}
//               >
//                 <i className="fa-solid fa-delete-left"></i>
//               </button>
//               <button
//                 className="replace-button"
//                 onClick={handleReplaceAudio}
//                 disabled={!audio}
//               >
//                 <i className="fa-solid fa-rotate"></i>
//               </button>
//             </div>
//             <input
//               className="form-control form-control-sm import-file-input"
//               type="file"
//               accept="audio/mp3, audio/wav, audio/aac, audio/x-m4a"
//               onChange={handleAudioImport}
//             />
//             <TranscribeButton
//               isLoading={isLoading}
//               transcribe={handleTranscribe}
//               data={audio}
//             />
//           </div>
//         </Row>
//       </Container>
//       <RecordModal
//         show={showModal}
//         onHide={handleClose}
//         stopRecording={handleStopRecording}
//         startRecording={handleStartRecording}
//         isRecording={isRecording}
//       />
//       <DeleteModal
//         show={showRemove}
//         onHide={handleCloseRemove}
//         handler={handleRemoveAudioText}
//       />
//     </>
//   );
// };

// export default SpeechToText;
