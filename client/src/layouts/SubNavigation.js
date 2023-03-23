import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// Bootstrap
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
// CSS
import "./layoutsCSS/MainNavigation.css";
import Col from "react-bootstrap/esm/Col";
import DownloadFile from "../components/DownloadFile";

const MainNavigation = () => {
  const [active, setActive] = useState("/");
  // Active tab styling
  const navLinkStyles = ({ isActive }) => {
    return {
      borderBottom: isActive ? "0" : "",
      border: isActive ? "1px solid #6e6e6e" : "",
      backgroundColor: isActive ? "#252424" : "",
      color: "#f5f5f5",
    };
  };

  return (
    <Container className="main-navigation-container">
      <Col>
        <Nav
          className="main-navigation justify-content-center"
          variant="tabs"
          defaultActiveKey="/speechtotext"
          activeKey={active}
          onSelect={(selectedKey) => setActive(selectedKey)}
        >
          <Nav.Item>
            <Nav.Link as={NavLink} to={"/speechtotext"} style={navLinkStyles}>
              Speech to text
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to={"/texttospeech"} style={navLinkStyles}>
              Text to Speech
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
    </Container>
  );
};

export default MainNavigation;
