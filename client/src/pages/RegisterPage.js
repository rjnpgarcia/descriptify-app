import React from "react";
// Components
import SubNavigation from "../layouts/SubNavigation.js";
// Bootstrap
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button.js";
// CSS
import "./pagesCSS/RegisterPage.css";

const RegisterPage = () => {
  return (
    <Container className="auth-container">
      <Row className="d-flex">
        <Col xs className="sub-nav-container">
          <SubNavigation />
        </Col>
      </Row>
      <Row className="register-form-row">
        <Col xs>FORMS</Col>
      </Row>
      <Row>
        <Button>Register</Button>
      </Row>
    </Container>
  );
};

export default RegisterPage;
