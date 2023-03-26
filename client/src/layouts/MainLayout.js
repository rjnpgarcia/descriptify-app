import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// Bootstrap
import Navbar from "react-bootstrap/Navbar";
// CSS
import "./layoutsCSS/MainLayout.css";
import LogoutModal from "./LogoutModal";
import UserMenu from "./UserMenu";
import ProfileModal from "./ProfileModal";

const MainLayout = ({ children, auth, isAuthenticated, tokenName }) => {
  const [showLogout, setShowLogout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Logout Modal handlers
  const handleShowLogout = () => {
    setShowLogout(true);
  };
  const handleCloseLogout = () => {
    setShowLogout(false);
  };
  // Profile Modal Handlers
  const handleShowProfile = () => {
    setShowProfile(true);
  };
  const handleCloseProfile = () => {
    setShowProfile(false);
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
              <UserMenu
                handleShowLogout={handleShowLogout}
                handleShowProfile={handleShowProfile}
                tokenName={tokenName}
              />
            ) : (
              ""
            )}
          </Navbar>
        </header>
        {children}
      </div>
      <LogoutModal
        show={showLogout}
        onHide={handleCloseLogout}
        tokenName={tokenName}
        auth={auth}
      />
      <ProfileModal
        show={showProfile}
        onHide={handleCloseProfile}
        tokenName={tokenName}
      />
    </>
  );
};

export default MainLayout;
