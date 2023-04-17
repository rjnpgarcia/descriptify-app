import React from "react";
// Components
import AuthNavigation from "../layouts/AuthNavigation.js";
// Bootstrap
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
// CSS
import "../layouts/layoutsCSS/AuthLayout.css";

const AuthLayout = ({ children }) => {
  return (
    <Container className="auth-container">
      <Row>
        <Col xs className="auth-header-container">
          <img
            src="./images/main-logo-borderless.png"
            alt="D logo"
            className="auth-logo"
          />
        </Col>
      </Row>
      <Row className="d-flex">
        <Col xs className="auth-nav-container">
          <AuthNavigation />
        </Col>
      </Row>
      {children}
    </Container>
  );
};

export default AuthLayout;
