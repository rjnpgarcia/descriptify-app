import React from "react";
import { NavLink } from "react-router-dom";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
// CSS
import "./layoutsCSS/MainLayout.css";
// Components
import MainNavigation from "./MainNavigation";

const MainLayout = ({ children }) => {
  return (
    <div className="App">
      <header>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand as={NavLink} to={"/"}>
            <img
              alt=""
              src="images/main-logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Descriptify App
          </Navbar.Brand>
        </Navbar>
      </header>
      <Container className="main-container">
        <Row>
          <Col xs md="2" className="nav-container">
            <MainNavigation />
          </Col>
          <Col xs md="10">
            <div className="content-container">{children}</div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainLayout;
