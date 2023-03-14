import React, { useRef } from "react";

const AudioRecorder = ({ setIsRecording }) => {
  const mediaRecorder = useRef(null);
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((mediaStreamObj) => {
        let dataArray = [];
        mediaRecorder.current = new MediaRecorder(mediaStreamObj);
        mediaRecorder.current.ondataavailable = function (ev) {
          dataArray.push(ev.data);
        };
        mediaRecorder.current.onstop = function () {
          let audioData = new Blob(dataArray, { type: "audio/mp3;" });
          let audioSrc = window.URL.createObjectURL(audioData);
          setAudioSrc(audioSrc);
          setIsRecording(false);
          dataArray = [];
        };
      });
  }, [setIsRecording]);

  const startrecording = () => {
    setIsRecording(true);
    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current.stop();
  };
};
