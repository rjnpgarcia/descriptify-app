import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function LogoutModal({ show, onHide, auth, tokenName }) {
  const navigate = useNavigate();

  // Logout User
  const handleLogout = () => {
    localStorage.removeItem(tokenName);
    auth(false);
    onHide();
    navigate("/login");
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
