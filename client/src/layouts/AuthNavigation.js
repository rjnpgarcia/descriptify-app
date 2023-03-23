import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// Bootstrap
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/esm/Container";
// CSS
import "./layoutsCSS/AuthNavigation.css";

const SubNavigation = () => {
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
    <Container className="sub-navigation-container">
      <Nav
        className="sub-navigation"
        variant="tabs"
        defaultActiveKey="/speechtotext"
        activeKey={active}
        onSelect={(selectedKey) => setActive(selectedKey)}
      >
        <Nav.Item>
          <Nav.Link as={NavLink} to={"/login"} style={navLinkStyles}>
            Login
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={"/register"} style={navLinkStyles}>
            Register
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
};

export default SubNavigation;
