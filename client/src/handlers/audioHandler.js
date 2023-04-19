const mimeType = "audio/mpeg";

// Set MediaRecorder API then start recording
export const startRecording = async (mediaRecorder, setAudioChunks) => {
  try {
    // To check if MediaRecorder is supported by browser
    if ("MediaRecorder" in window) {
      // Get user microphone
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      // Start Audio Recorder via MediaRecorder API
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
    alert("Something went wrong with the recording");
  }
};

// Stop voice recording and set audio for transcription
export const stopRecording = (
  mediaRecorder,
  audioChunks,
  setAudio,
  setAudioChunks
) => {
  mediaRecorder.current.stop();
  mediaRecorder.current.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudio(audioUrl);
    setAudioChunks([]);
  };
};
