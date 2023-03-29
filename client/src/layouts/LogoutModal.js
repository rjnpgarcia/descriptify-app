import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Cookies from "js-cookie";

function LogoutModal({ show, onHide, auth, tokenName }) {
  // Logout User
  const handleLogout = () => {
    Cookies.remove(tokenName);
    auth(false);
    onHide();
    window.location.href = "/login";
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
