import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
// Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
// CSS
import "./layoutsCSS/OpenFileModal.css";
// Handlers
import { useAuth } from "../contexts/AuthHandler";
import { useFile } from "../contexts/FileHandler";
import { useNavigate } from "react-router-dom";

const OpenFileModal = ({ show, onHide }) => {
  const { tokenName } = useAuth();
  const { id } = JSON.parse(Cookies.get(tokenName));
  const [sttFiles, setSttFiles] = useState([]);
  const [ttsFiles, setTtsFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { setGetFile } = useFile();
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
    // Get all files of user
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/files/${id}`);
        const data = await response.json();
        if (data.sttFiles || data.ttsFiles) {
          setSttFiles(data.sttFiles);
          setTtsFiles(data.ttsFiles);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [show, id]);

  // To open a file based on its type
  const handleOpenfile = async (fileName, type) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/files/${id}/${type}/${fileName}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      const dataGet = {
        id,
        type,
        name: fileName,
        transcript: data,
      };
      console.log(data);
      setGetFile(dataGet);
      if (type === "stt") {
        navigate("/speechtotext");
      } else if (type === "tts") {
        navigate("/texttospeech");
      }
      onHide();
    } catch (error) {
      console.log(error);
      setGetFile({});
    }
  };

  // To delete a file from user
  const handleDelete = async (fileName, type) => {
    // Alert user to confirm delete
    const confirmed = window.confirm("Are you sure you want to delete file?");
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/files/${id}/${type}/${fileName}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        if (type === "stt") {
          setSttFiles(data.updatedUserFiles);
        } else {
          setTtsFiles(data.updatedUserFiles);
          console.log(data.updatedUserFiles);
        }
        setSuccessMessage(data.success);
      }
      if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again");
    }
  };
  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>Select file to open</Modal.Title>
      </Modal.Header>
      <Modal.Body className="open-file-modal-body">
        {errorMessage ? <p className="validation-error">{errorMessage}</p> : ""}
        {successMessage ? (
          <p className="validation-success">{successMessage}</p>
        ) : (
          ""
        )}
        <h3>Speech-to-Text files</h3>
        {sttFiles.length === 0 ? (
          <p className="text-secondary">No saved file</p>
        ) : (
          <ul>
            {sttFiles.map((file, index) => (
              <li key={index} className="file-list-item">
                <span
                  className="file-name-span"
                  onClick={() => handleOpenfile(file.name, "stt")}
                >
                  {file.name}
                </span>
                <button
                  onClick={() => handleDelete(file.name, "stt")}
                  className="delete-file-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3>Text-to-Speech files</h3>
        {ttsFiles.length === 0 ? (
          <p className="text-secondary">No saved file</p>
        ) : (
          <ul>
            {ttsFiles.map((file, index) => (
              <li key={index} className="file-list-item">
                <span
                  className="file-name-span"
                  onClick={() => handleOpenfile(file.name, "tts")}
                >
                  {file.name}
                </span>
                <span>
                  <button
                    onClick={() => handleDelete(file.name, "tts")}
                    className="delete-file-button"
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OpenFileModal;
