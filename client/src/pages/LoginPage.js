import React from "react";
import { NavLink } from "react-router-dom";
// Components
import AuthLayout from "../layouts/AuthLayout.js";
// Bootstrap
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel.js";

const LoginPage = () => {
  return (
    <AuthLayout>
      <Form>
        <Row>
          <Col xs>
            <FloatingLabel label="Email" className="text-secondary m-3">
              <Form.Control type="email" placeholder="Enter your email here" />
            </FloatingLabel>
            <FloatingLabel label="Password" className="text-secondary m-3">
              <Form.Control
                type="password"
                placeholder="Enter your password here"
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
          <button className="auth-button">
            <i className="fa-solid fa-circle-chevron-right" />
          </button>
        </Row>
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;
