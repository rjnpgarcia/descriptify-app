import React, { useState } from "react";
import Cookies from "js-cookie";
// Bootstrap
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel.js";
import Button from "react-bootstrap/esm/Button";
// CSS
import "./layoutsCSS/ProfileModal.css";
import { deleteUser, updateUser } from "../handlers/userHandler";

const ProfileModal = ({ show, onHide, tokenName, userData }) => {
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const { id, name } = userData;
    const updatedData = {};

    if (newName === "" && newPassword === "") {
      setErrorMessage("Nothing has changed");
      return;
    }

    if (newName !== name && newName !== "") {
      if (newName.length < 4) {
        setErrorMessage("Name must have 4 or more characters");
        return;
      }
      updatedData.name = newName;
    }
    if (newPassword !== "") {
      if (newPassword.length < 4) {
        setErrorMessage("Password must have 4 or more characters");
        return;
      }
      updatedData.password = newPassword;
    }

    // Update profile to MongoDB
    await updateUser(
      id,
      updatedData,
      tokenName,
      setErrorMessage,
      setSuccessMessage
    );
  };

  // Delete user from MongoDB
  const handleDelete = async () => {
    const { id } = userData;
    await deleteUser(id, setErrorMessage, tokenName);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {userData ? (
          <Form onSubmit={handleSubmitUpdate} className="update-form">
            {errorMessage ? (
              <p className="validation-error">{errorMessage}</p>
            ) : (
              ""
            )}
            {successMessage ? (
              <p className="validation-success">{successMessage}</p>
            ) : (
              ""
            )}
            <FloatingLabel
              label={userData.name ? `Name: ${userData.name}` : "Name"}
              className="text-secondary m-3"
            >
              <Form.Control
                type="name"
                onChange={(e) => setNewName(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel label="Email" className="text-secondary m-3">
              <Form.Control type="email" value={userData.email} disabled />
            </FloatingLabel>
            <FloatingLabel label="Password" className="text-secondary m-3">
              <Form.Control
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="true"
              />
            </FloatingLabel>
            <Button variant="primary" type="submit" className="m-3">
              Save Changes
            </Button>
          </Form>
        ) : (
          ""
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete Account
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileModal;
