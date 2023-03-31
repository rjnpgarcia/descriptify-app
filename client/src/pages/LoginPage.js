import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Cookies from "js-cookie";
// Components
import AuthLayout from "../layouts/AuthLayout.js";
// Bootstrap
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel.js";
import Spinner from "react-bootstrap/esm/Spinner.js";
import { loginUser } from "../handlers/userHandler.js";
import { useAuth } from "../contexts/AuthHandler.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState("");
  const { setIsAuthenticated, tokenName } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = Cookies.get(tokenName);
    if (userData) {
      console.log(userData);
      setIsAuthenticated(true);
      navigate("/");
    }
  }, [setIsAuthenticated, navigate, tokenName]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation for empty fields
    if (!email || !password) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    // Gathers form data
    const loginData = {
      email,
      password,
    };

    setIsLoading(true);
    // Send data for login
    await loginUser(
      loginData,
      setErrorMessage,
      setIsAuthenticated,
      tokenName,
      navigate
    );
    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <Form onSubmit={handleSubmitLogin}>
        <Row>
          <Col xs>
            {errorMessage ? (
              <p className="validation-error">{errorMessage}</p>
            ) : (
              ""
            )}
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
              Create an account?{" "}
              <NavLink to="/register" className="text-decoration-none">
                Register here
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

export default LoginPage;
