import React from "react";
import { NavLink } from "react-router-dom";
// Bootstrap
import Navbar from "react-bootstrap/Navbar";
// CSS
import "./layoutsCSS/MainLayout.css";

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
      {/* <Container className="main-container">
        <Row className="d-flex">
          <Col xs className="nav-container">
            <MainNavigation />
          </Col>
        </Row>
        <Row className="content-row">
          <Col xs>{children}</Col>
        </Row>
      </Container> */}
      {children}
    </div>
  );
};

export default MainLayout;
