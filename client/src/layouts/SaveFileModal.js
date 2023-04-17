import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
// Bootstrap
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Button from "react-bootstrap/esm/Button";
// CSS
import "./layoutsCSS/SaveFileModal.css";
// Handlers
import { useFile } from "../contexts/FileHandler";
import { useAuth } from "../contexts/AuthHandler";

const SaveFileModal = ({ show, onHide }) => {
  const { tokenName } = useAuth();
  const { id } = JSON.parse(Cookies.get(tokenName));
  const [fileName, setFileName] = useState("");
  const { saveFile } = useFile();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setErrorMessage("");
    setFileName("");
  }, [onHide]);

  const handleSaveFile = async (e) => {
    e.preventDefault();
    console.log(saveFile);
    console.log(fileName);
    try {
      let transciptData = "";
      const res = await fetch(saveFile.audio);
      const audioBlob = await res.blob();
      console.log(audioBlob);
      const formData = new FormData();
      if (saveFile.stt) {
        transciptData = JSON.stringify(saveFile.transcript);
        formData.append("stt", saveFile.stt);
      } else if (saveFile.tts) {
        transciptData = saveFile.transcript;
        formData.append("tts", saveFile.tts);
      }
      console.log(saveFile.tts);
      formData.append(
        "audioFile",
        audioBlob,
        `${
          saveFile.tts ? fileName + "-tts-" + id : fileName + "-stt-" + id
        }.mp3`
      );
      formData.append("name", fileName);
      formData.append("transcript", transciptData);
      console.log(id);
      const response = await fetch(`http://localhost:8000/api/files/${id}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        console.log(data.success);
        onHide();
      } else {
        console.log(data.error);
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Save file?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="save-file-modal-body">
        <Form onSubmit={handleSaveFile}>
          {errorMessage ? (
            <p className="validation-error">{errorMessage}</p>
          ) : (
            ""
          )}
          <FloatingLabel label="Enter file name" className="text-secondary">
            <Form.Control
              type="text"
              placeholder="Enter file name"
              required
              onChange={(e) => setFileName(e.target.value)}
            />
          </FloatingLabel>
          <div className="save-file-modal-buttons">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveFile}
              disabled={
                saveFile.audio === null || saveFile.transcript === ""
                  ? true
                  : ""
              }
              type="submit"
            >
              Save file
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SaveFileModal;
