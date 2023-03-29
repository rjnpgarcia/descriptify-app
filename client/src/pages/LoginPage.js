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

const LoginPage = ({ auth, tokenName }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // const userData = JSON.parse(localStorage.getItem(tokenName));
    const userData = Cookies.get(tokenName);
    if (userData) {
      console.log(userData);
      auth(true);
      navigate("/");
    }
  }, [auth, navigate, tokenName]);

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

    try {
      setIsLoading(true);
      // Send data for login
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      // Handling data
      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else if (data.success) {
        console.log(data.success);
        auth(true);
        // localStorage.setItem(tokenName, JSON.stringify(data.success));
        Cookies.set(tokenName, JSON.stringify(data.success), { expires: 5 });
        navigate("/");
      } else {
        setErrorMessage("Something went wrong, Please try again");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.");
      setIsLoading(false);
    }
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
