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

  useEffect(() => {
    setErrorMessage("");
    setFileName("");
  }, [onHide]);

  const handleSaveFile = async (e) => {
    e.preventDefault();
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
