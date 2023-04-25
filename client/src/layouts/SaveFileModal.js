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
  const { saveAsFile, saveFile, setOverwriteFile } = useFile();
  const [errorMessage, setErrorMessage] = useState("");
  const [collectFilename, setCollectFilename] = useState([]);

  useEffect(() => {
    setErrorMessage("");
    setFileName("");
    // Get all files of user
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/files/${id}`);
        const data = await response.json();
        let existingFile = [];
        if (data.sttFiles && saveFile.stt) {
          existingFile = [...existingFile, ...data.sttFiles];
        }
        if (data.ttsFiles && saveFile.tts) {
          existingFile = [...existingFile, ...data.ttsFiles];
        }
        setCollectFilename(existingFile);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [onHide, id, saveFile]);

  const handleSaveFile = async (e) => {
    e.preventDefault();
    const filenameExists = collectFilename.some(
      (file) => file.name === fileName
    );

    if (filenameExists) {
      const confirmed = window.confirm(
        "File name already exists. Do you want to overwrite file?"
      );
      if (!confirmed) {
        return;
      }
    }
    // if (collectFilename.length !== 0) {
    //   for (let i = 0; collectFilename.length > i; i++) {
    //     if (collectFilename[i].name === fileName) {
    //       // Alert user to overwrite file
    //       const confirmed = window.confirm(
    //         "File name already exists. Do you want to overwrite file?"
    //       );
    //       if (!confirmed) {
    //         return;
    //       } else {
    //         saveAsFile(fileName, id, onHide, setErrorMessage);
    //       }
    //       return;
    //     }
    //   }
    // }

    await saveAsFile(fileName, id, onHide, setErrorMessage);
    setOverwriteFile({ name: fileName, id });
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
