import React, { useEffect, useState } from "react";
// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const OverdubModal = ({ word, show, onHide, audio, setAudio, setChanges }) => {
  const [overdubValue, setOverdubValue] = useState("");

  useEffect(() => {
    if (word.word) {
      setOverdubValue(word.word);
    } else {
      setOverdubValue("");
    }
  }, [word.word]);

  const handleInputChange = (e) => {
    setOverdubValue(e.target.value);
  };

  const handleDeleteWord = async () => {
    // Removes the word from the transcription
    // const updatedTranscript = transcript.filter((item) => item !== word);
    // setTranscriptWithTS(updatedTranscript);

    // Finds the audio region with the same timestamps as the word then trim audio
    try {
      const formData = new FormData();
      const res = await fetch(audio.present);
      const audioBlob = await res.blob();
      formData.append("audioFile", audioBlob, "audio.mp3");
      formData.append("startTime", word.startTime);
      formData.append("endTime", word.endTime);
      const response = await fetch("http://localhost:8000/api/trimaudio", {
        method: "POST",
        body: formData,
      });
      const audioData = await response.blob();
      if (response.ok) {
        const audioUrl = URL.createObjectURL(audioData);
        setAudio(audioUrl);

        // Remove the word from the transcript and adjust the timestamps of other words
        // const duration = word.endTime - word.startTime;
        // const updatedTranscript = transcriptWithTS.present.filter(
        //   (item, index) => {
        //     if (item.startTime >= word.endTime) {
        //       // Adjust the start and end times of this word
        //       item.startTime -= duration;
        //       item.endTime -= duration;
        //     }

        //     return (
        //       item !== word &&
        //       (index === 0 ||
        //         item.startTime !== transcriptWithTS.present[index - 1].endTime)
        //     );
        //   }
        // );
        // // setTranscriptWithTS(updatedTranscript);
        setChanges(true);
        onHide();
      }
    } catch (error) {
      console.error(error.message);
      onHide();
    }
  };

  const handleOverdub = async () => {
    // Finds the audio region with the same timestamps as the word then trim audio
    try {
      const formData = new FormData();
      const res = await fetch(audio.present);
      const audioBlob = await res.blob();
      formData.append("audioFile", audioBlob, "audio.mp3");
      formData.append("startTime", word.startTime);
      formData.append("endTime", word.endTime);
      formData.append("overdubWord", overdubValue);
      const response = await fetch("http://localhost:8000/api/overdub", {
        method: "POST",
        body: formData,
      });
      const audioData = await response.blob();
      if (response.ok) {
        const audioUrl = URL.createObjectURL(audioData);
        setAudio(audioUrl);
        setChanges(true);
        onHide();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOverdub();
  };

  return (
    <Modal show={show} onHide={onHide} size="sm" centered>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Label>Overdub</Form.Label>
          <Form.Control
            type="text"
            value={overdubValue}
            onChange={handleInputChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="danger" onClick={handleDeleteWord}>
          Remove
        </Button>
        <Button variant="primary" onClick={handleOverdub}>
          Overdub
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OverdubModal;
