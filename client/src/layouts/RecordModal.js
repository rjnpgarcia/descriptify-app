import React, { useState } from "react";
// React-bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// CSS
import "./layoutsCSS/RecordModal.css";
import Container from "react-bootstrap/esm/Container";

const RecordModal = ({
  show,
  onHide,
  startRecording,
  stopRecording,
  isRecording,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Record to script
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isRecording ? (
          <div className="record-animation">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
            <div className="bar bar4"></div>
            <div className="bar bar5"></div>
            <div className="bar bar6"></div>
            <div className="bar bar7"></div>
            <div className="bar bar8"></div>
          </div>
        ) : (
          <div className="record-animation">
            <div className="bar-stop"></div>
            <div className="bar-stop"></div>
            <div className="bar-stop"></div>
            <div className="bar-stop"></div>
            <div className="bar-stop"></div>
            <div className="bar-stop"></div>
            <div className="bar-stop"></div>
            <div className="bar-stop"></div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {isRecording ? (
          <Button className="record-stop-button" onClick={stopRecording}>
            Stop Recording
          </Button>
        ) : (
          <Button className="record-button" onClick={startRecording}>
            Start Recording
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default RecordModal;
