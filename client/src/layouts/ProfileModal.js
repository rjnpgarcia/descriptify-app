import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel.js";
import Button from "react-bootstrap/esm/Button";
// CSS
import "./layoutsCSS/ProfileModal.css";

const ProfileModal = ({ show, onHide, tokenName }) => {
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const userData = JSON.parse(localStorage.getItem(tokenName));

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const { _id, name } = userData;
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

    try {
      const response = await fetch(`http://localhost:8000/api/user/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
      }
      if (data.success) {
        setSuccessMessage(data.success);
        localStorage.removeItem(tokenName);
        localStorage.setItem(tokenName, JSON.stringify(data.user));
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async () => {
    const { _id } = userData;
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete account?"
      );
      if (!confirmed) {
        return;
      }

      const response = await fetch(`http://localhost:8000/api/user/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem(tokenName);
        window.location.href = "/login";
      } else if (data.error) {
        setErrorMessage(data.error);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.");
    }
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
