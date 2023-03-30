import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DeleteModal({ show, onHide, handler }) {
  return (
    <Modal show={show} onHide={onHide} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to clear audio and text?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="danger" onClick={handler}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
