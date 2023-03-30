import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { logoutUser } from "../handlers/userHandler";

function LogoutModal({ show, onHide, auth, tokenName }) {
  // Logout User
  const handleLogout = () => {
    logoutUser(auth, tokenName);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to logout?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="danger" onClick={handleLogout}>
          LOGOUT
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogoutModal;
