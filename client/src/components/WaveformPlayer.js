import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveformPlayer = ({ audio, setWaveform }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      height: 0,
    });
    setWaveform(wavesurfer);
    if (audio) {
      wavesurfer.load(audio);
    }
  }, [audio, setWaveform]);

  return (
    <div className="d-none">
      <div ref={waveformRef} />
    </div>
  );
};

export default WaveformPlayer;
