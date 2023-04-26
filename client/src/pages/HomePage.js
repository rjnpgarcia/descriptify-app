import React, { useEffect } from "react";
// Components
import SubLayout from "../layouts/SubLayout";
// Bootstrap
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
// CSS
import "./pagesCSS/HomePage.css";
import { useAuth } from "../contexts/AuthHandler";

const HomePage = () => {
  const { pageStorageName } = useAuth();
  // To store if this is the last page visited. For browser refresh to stay in the page.
  useEffect(() => {
    localStorage.setItem(pageStorageName, "/");
  }, [pageStorageName]);

  return (
    <SubLayout>
      <Container className="home-container">
        <Row>
          <Col xs>
            <img
              src="images/main-logo.png"
              alt="Descript large logo"
              className="home-logo"
            />
            <h2 className="home-title">
              <span className="home-welcome">Welcome to </span>
              <strong>Descriptify</strong>
            </h2>
            <h3 className="home-slogan">Where transcription made it easy</h3>
          </Col>
        </Row>
      </Container>
    </SubLayout>
  );
};

export default HomePage;
