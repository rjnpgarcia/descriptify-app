import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import "./componentsCSS/Waveform.css";

const Waveform = ({ audio, setWaveform, transcriptWithTS }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    let markerObj = [];
    let regionObj = [];
    if (transcriptWithTS) {
      for (let i = 0; i < transcriptWithTS.length; i++) {
        if (transcriptWithTS[i].startTime) {
          markerObj.push({
            time: transcriptWithTS[i].startTime,
            label: transcriptWithTS[i].word,
            color: "gray",
          });

          regionObj.push({
            start: transcriptWithTS[i].startTime,
            end: transcriptWithTS[i].endTime,
            drag: false,
            resize: false,
          });
        }
      }
    }

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#8a93e2",
      progressColor: "violet",
      height: 50,
      barWidth: 1,
      barHeight: 2,
      plugins: [
        RegionsPlugin.create({
          regions: regionObj,
        }),
        MarkersPlugin.create({
          markers: markerObj,
        }),
      ],
    });
    setWaveform(wavesurfer);
    if (audio) {
      wavesurfer.load(audio);

      return () => wavesurfer.destroy();
    } else {
      wavesurfer.empty();
      return () => wavesurfer.destroy();
    }
  }, [audio, setWaveform, transcriptWithTS]);

  return (
    <div className="waveform-container">
      <div ref={waveformRef} />
    </div>
  );
};

export default Waveform;
