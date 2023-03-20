// import React, { useState, useEffect, useRef } from "react";
// // Components
// import Container from "react-bootstrap/esm/Container";
// import Row from "react-bootstrap/esm/Row";
// import "./componentsCSS/SpeechToText.css";
// import TextEditor from "./TextEditor.js";

// const SpeechToText = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [interim, setInterim] = useState("");
//   const recognition = useRef(null);
//   // const mediaRecorder = useRef();
//   // const playAudioSrc = useRef(null);

//   useEffect(() => {
//     // Initialize recognition instance
//     recognition.current = new window.webkitSpeechRecognition();
//     recognition.current.continuous = true;
//     recognition.current.interimResults = true;
//     recognition.current.lang = "en-US";

//     recognition.current.onresult = (e) => {
//       let interimTranscript = "";
//       let finalTranscript = "";
//       for (let i = e.resultIndex; i < e.results.length; i++) {
//         const transcript = e.results[i][0].transcript;
//         if (e.results[i].isFinal) {
//           finalTranscript += transcript;
//         } else {
//           interimTranscript += transcript;
//         }
//       }
//       setInterim(interimTranscript);
//       setTranscript(finalTranscript);
//     };
//     recognition.current.onend = () => {
//       setIsRecording(false);
//     };

//     recognition.current.onerror = (e) => {
//       console.log(e.error);
//       setIsRecording(false);
//     };
//   }, []);

//   const handleStartRecording = () => {
//     setIsRecording(true);

//     recognition.current.start();
//   };

//   const handleStopRecording = () => {
//     setIsRecording(false);

//     recognition.current.stop();
//   };

//   const handleClearTranscript = () => {
//     setTranscript("");
//   };

//   const handleChange = (e) => {
//     setTranscript(e.target.value);
//   };

//   return (
//     <Container>
//       <h3 className="feature-title">
//         <i class="fa-solid fa-microphone"></i> Speech to Text
//       </h3>
//       <Row className="justify-content-center mt-3">
//         <TextEditor
//           transcript={isRecording ? interim : transcript}
//           handler={handleChange}
//           placeholder="This is where the transcription will be displayed"
//         />
//       </Row>
//       <Row className="justify-content-center">
//         <div className="stt-buttons-container">
//           <div className="stt-controls-container">
//             <button className="stt-play-button">
//               <i className="fa-solid fa-play" style={{ color: "#05a705" }}></i>
//             </button>
//             {isRecording ? (
//               <button onClick={handleStopRecording}>
//                 <i className="fa-solid fa-stop"></i>
//               </button>
//             ) : (
//               <button onClick={handleStartRecording} className="record-button">
//                 <i
//                   className="fa-solid fa-microphone"
//                   style={{ color: "#e20808" }}
//                 ></i>
//               </button>
//             )}
//             <button>
//               <i className="fa-solid fa-rotate"></i>
//             </button>
//             <button onClick={handleClearTranscript}>
//               <i className="fa-solid fa-delete-left"></i>
//             </button>
//           </div>
//           <div className="stt-import-container">
//             <button>Import Audio</button>
//           </div>
//         </div>
//       </Row>
//     </Container>
//   );
// };

// export default SpeechToText;
