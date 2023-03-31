import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Components
import AuthLayout from "../layouts/AuthLayout.js";
// Bootstrap
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel.js";
import Spinner from "react-bootstrap/Spinner";
// Handler
import { registerUser } from "../handlers/userHandler.js";
// Context
import { useAuth } from "../contexts/AuthHandler.js";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState("");
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation for empty fields
    if (!name || !email || !password) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }
    // Gathers form data
    const registerData = {
      name,
      email,
      password,
    };

    // Register user data to MongoDB
    setIsLoading(true);
    await registerUser(
      registerData,
      setErrorMessage,
      setSuccessMessage,
      setIsAuthenticated,
      navigate
    );
    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs>
            {errorMessage ? (
              <p className="validation-error">{errorMessage}</p>
            ) : (
              ""
            )}
            {successMessage ? (
              <p className="validation-success">
                {successMessage}
                <br />
                <NavLink to="/login" className="text-decoration-none">
                  Login here
                </NavLink>
              </p>
            ) : (
              ""
            )}
            <FloatingLabel label="Name" className="text-secondary m-3">
              <Form.Control
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel label="Email" className="text-secondary m-3">
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel label="Password" className="text-secondary m-3">
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="true"
              />
            </FloatingLabel>
            <p className="auth-redirect-link">
              Already have an account?{" "}
              <NavLink to="/login" className="text-decoration-none">
                Login here
              </NavLink>
            </p>
          </Col>
        </Row>
        <Row>
          <button className="auth-button" type="submit">
            {isLoading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              <i className="fa-solid fa-circle-chevron-right" />
            )}
          </button>
        </Row>
      </Form>
    </AuthLayout>
  );
};

export default RegisterPage;
