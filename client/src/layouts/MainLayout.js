import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// Bootstrap
import Navbar from "react-bootstrap/Navbar";
// CSS
import "./layoutsCSS/MainLayout.css";
// Components
import LogoutModal from "./LogoutModal";
import UserMenu from "./UserMenu";
// Context
import { useAuth } from "../contexts/AuthHandler";

const MainLayout = ({ children }) => {
  const [showLogout, setShowLogout] = useState(false);
  const { isAuthenticated } = useAuth();

  // Logout Modal handlers
  const handleShowLogout = () => {
    setShowLogout(true);
  };
  const handleCloseLogout = () => {
    setShowLogout(false);
  };

  const handleDownloadDocs = () => {
    window.location.href = "/api/downloaddocs";
  };

  return (
    <>
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
            {isAuthenticated ? (
              <UserMenu handleShowLogout={handleShowLogout} />
            ) : (
              ""
            )}
            <button className="document-download" onClick={handleDownloadDocs}>
              Document
            </button>
          </Navbar>
        </header>
        {children}
      </div>
      <LogoutModal show={showLogout} onHide={handleCloseLogout} />
    </>
  );
};

export default MainLayout;
