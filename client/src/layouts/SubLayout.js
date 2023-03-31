import React, { useState } from "react";
// Handlers
import { DownloadContext } from "../handlers/DownloadContext.js";
// Components
import MainNavigation from "../layouts/MainNavigation";
// Bootstrap
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
// CSS
import "../layouts/layoutsCSS/SubLayout.css";

const SubLayout = ({ children }) => {
  const [dataTranscript, setDataTranscript] = useState("");
  const [dataAudio, setDataAudio] = useState(null);

  return (
    <DownloadContext.Provider
      value={{ dataTranscript, setDataTranscript, dataAudio, setDataAudio }}
    >
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
    </DownloadContext.Provider>
  );
};

export default SubLayout;
