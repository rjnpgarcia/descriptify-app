import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// Bootstrap
import Nav from "react-bootstrap/Nav";
// CSS
import "./layoutsCSS/MainNavigation.css";

const MainNavigation = () => {
  const [active, setActive] = useState("/");
  // Active tab styling
  const navLinkStyles = ({ isActive }) => {
    return {
      borderBottom: isActive ? "1px solid #b1b1b1" : "",
      color: "#f5f5f5",
    };
  };

  return (
    <Nav
      className="main-navigation-container flex-column"
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
  );
};

export default MainNavigation;
