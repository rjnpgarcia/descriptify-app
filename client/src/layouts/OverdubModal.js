import React, { useEffect, useState } from "react";
// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

const OverdubModal = ({ word, show, onHide, audio, setAudio, setChanges }) => {
  const [overdubValue, setOverdubValue] = useState("");
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoadingOverdub, setIsLoadingOverdub] = useState(false);

  useEffect(() => {
    if (word.word) {
      setOverdubValue(word.word);
    } else {
      setOverdubValue("");
    }
  }, [word.word, onHide]);

  const handleInputChange = (e) => {
    setOverdubValue(e.target.value);
  };

  const handleDeleteWord = async () => {
    try {
      setIsLoadingRemove(true);
      const formData = new FormData();
      const res = await fetch(audio.present);
      const audioBlob = await res.blob();
      formData.append("audioFile", audioBlob, "audio.mp3");
      formData.append("startTime", word.startTime);
      formData.append("endTime", word.endTime);
      const response = await fetch("/api/trimaudio", {
        method: "POST",
        body: formData,
      });
      const audioData = await response.blob();
      if (response.ok) {
        const audioUrl = URL.createObjectURL(audioData);
        setAudio(audioUrl);
        setChanges(true);
        setIsLoadingRemove(false);
        onHide();
      } else {
        setIsLoadingRemove(false);
        onHide();
      }
    } catch (error) {
      setIsLoadingRemove(false);
      onHide();
    }
  };

  const handleOverdub = async () => {
    try {
      setIsLoadingOverdub(true);
      const formData = new FormData();
      const res = await fetch(audio.present);
      const audioBlob = await res.blob();
      formData.append("audioFile", audioBlob, "audio.mp3");
      formData.append("startTime", word.startTime);
      formData.append("endTime", word.endTime);
      formData.append("overdubWord", overdubValue);
      const response = await fetch("/api/overdub", {
        method: "POST",
        body: formData,
      });
      const audioData = await response.blob();
      if (response.ok) {
        const audioUrl = URL.createObjectURL(audioData);
        setAudio(audioUrl);
        setChanges(true);
        setIsLoadingOverdub(false);
        onHide();
      } else {
        setIsLoadingOverdub(false);
        onHide();
      }
    } catch (err) {
      setIsLoadingOverdub(false);
      onHide();
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
        <Button
          variant="danger"
          onClick={handleDeleteWord}
          disabled={isLoadingOverdub ? true : false}
        >
          {isLoadingRemove ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            ""
          )}
          Remove
        </Button>
        <Button
          variant="primary"
          onClick={handleOverdub}
          disabled={isLoadingRemove ? true : false}
        >
          {isLoadingOverdub ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            ""
          )}
          Overdub
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OverdubModal;
