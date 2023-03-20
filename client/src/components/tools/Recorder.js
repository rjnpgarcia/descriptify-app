// import React, { useRef, useState } from "react";
// import Button from "react-bootstrap/Button";

// const AudioRecorder = ({ setIsRecording }) => {
//   const [isRecordingAudio, setIsRecordingAudio] = useState(false);
//   const [recordedBlob, setRecordedBlob] = useState(null);
//   const mediaRecorder = useRef(null);

//   const startRecording = () => {
//     setIsRecordingAudio(true);
//     const mediaStream = navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaStream.then((stream) => {
//       mediaRecorder.current = new MediaRecorder(stream);
//       mediaRecorder.current.start();
//       const chunks = [];
//       mediaRecorder.current.addEventListener("dataavailable", (e) => {
//         chunks.push(e.data);
//       });
//       mediaRecorder.current.addEventListener("stop", () => {
//         setIsRecordingAudio(false);
//         const blob = new Blob(chunks, { type: "audio/wav" });
//         setRecordedBlob(blob);
//       });
//     });
//   };

//   const stopRecording = () => {
//     mediaRecorder.current.stop();
//   };

//   return (
//     <>
//       <Button
//         onClick={isRecordingAudio ? stopRecording : startRecording}
//         variant={isRecordingAudio ? "danger" : "success"}
//       >
//         {isRecordingAudio ? "Stop Recording" : "Start Recording"}
//       </Button>
//     </>
//   );
// };

export default AudioRecorder;
