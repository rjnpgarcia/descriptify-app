import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import "./componentsCSS/Waveform.css";

const Waveform = ({
  audio,
  setWaveform,
  transcriptWithTS,
  handleShowOverdub,
}) => {
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
            id: i,
            start: transcriptWithTS[i].startTime,
            end: transcriptWithTS[i].endTime,
            drag: false,
            resize: false,
            color: "rgba(80, 80, 80, 0.2)",
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
      scrollParent: false,
      splitChannels: true,
      splitChannelsOptions: {
        overlay: true,
        filterChannels: [],
      },
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
      // For overdub when region is clicked
      wavesurfer.on("region-click", (region) => {
        // e.stopPropagation();
        // pass the corresponding word data to the modal component
        const wordData = transcriptWithTS.find(
          (word) => word.startTime === region.start
        );

        handleShowOverdub(wordData);
      });

      wavesurfer.on("region-mouseenter", (region) => {
        region.update({ color: "rgba(177, 177, 177, 0.2)" });
      });
      wavesurfer.on("region-mouseleave", (region) => {
        region.update({ color: "rgba(80, 80, 80, 0.2)" });
      });

      return () => wavesurfer.destroy();
    } else {
      wavesurfer.empty();
      return () => wavesurfer.destroy();
    }
  }, [audio, setWaveform, transcriptWithTS, handleShowOverdub]);

  return (
    <div className="waveform-container">
      <div ref={waveformRef} />
    </div>
  );
};

export default Waveform;
