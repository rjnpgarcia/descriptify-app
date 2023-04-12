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
  isLoading,
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
            position: "top",
          });

          regionObj.push({
            id: i,
            start: transcriptWithTS[i].startTime,
            end: transcriptWithTS[i].endTime,
            drag: false,
            resize: true,
            color: "rgba(80, 80, 80, 0.2)",
          });
        }
      }
    }

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#8a93e2",
      progressColor: "violet",
      height: 60,
      barWidth: 1,
      barHeight: 2,
      minPxPerSec: 200,
      fillParent: true,
      scrollParent: true,
      responsive: true,
      plugins: [
        RegionsPlugin.create({
          regions: regionObj,
          dragSelection: {
            slop: 5,
            passive: true,
          },
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
      if (transcriptWithTS && !isLoading) {
        wavesurfer.on("region-click", (region) => {
          console.log(isLoading);
          // e.stopPropagation();
          // pass the corresponding word data to the modal component
          const wordData = transcriptWithTS.find(
            (word) => word.startTime === region.start
          );
          console.log(wordData);
          if (wordData) {
            handleShowOverdub(wordData);
          } else {
            const regionData = {
              word: "",
              startTime: region.start,
              endTime: region.end,
            };
            handleShowOverdub(regionData);
          }
        });
      }
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
  }, [audio, setWaveform, transcriptWithTS, handleShowOverdub, isLoading]);

  return (
    <div className="waveform-container">
      <div ref={waveformRef} />
    </div>
  );
};

export default Waveform;
