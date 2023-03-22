import React from "react";
import SpeechToText from "../components/SpeechToText.js";
// Components
import MainNavigation from "../layouts/MainNavigation.js";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const STTPage = () => {
  return (
    <Container className="main-container">
      <Row className="d-flex">
        <Col xs className="nav-container">
          <MainNavigation />
        </Col>
      </Row>
      <Row className="content-row">
        <Col xs>
          <SpeechToText />
        </Col>
      </Row>
    </Container>
  );
};

export default STTPage;
