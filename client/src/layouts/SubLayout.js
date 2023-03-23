import React from "react";
// Components
import MainNavigation from "../layouts/MainNavigation";
// Bootstrap
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
// CSS
import "../layouts/layoutsCSS/SubLayout.css";

const SubLayout = ({ children }) => {
  return (
    <Container className="main-container">
      <Row className="d-flex">
        <Col xs className="nav-container">
          <MainNavigation />
        </Col>
      </Row>
      <Row className="content-row">
        <Col xs>{children}</Col>
      </Row>
    </Container>
  );
};

export default SubLayout;
