import React from "react";
// Components
import MainNavigation from "../layouts/MainNavigation";
// Bootstrap
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
// CSS
import "./pagesCSS/HomePage.css";

const HomePage = () => {
  return (
    <Container className="main-container">
      <Row className="d-flex">
        <Col xs className="nav-container">
          <MainNavigation />
        </Col>
      </Row>
      <Row className="content-row">
        <Col xs>
          <Container className="home-container">
            <Row>
              <Col xs>
                <img
                  src="images/main-logo-trans.png"
                  alt="Descript large logo"
                  className="home-logo"
                />
                <h2 className="home-title">
                  <span className="home-welcome">Welcome to </span>
                  <strong>Descriptify</strong>
                </h2>
                <h3 className="home-slogan">
                  Where transcription made it easy
                </h3>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
