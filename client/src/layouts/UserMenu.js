import React, { useState } from "react";
import Cookies from "js-cookie";
// Bootstrap
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
// CSS
import "./layoutsCSS/UserMenu.css";
// Components
import ProfileModal from "./ProfileModal";

const UserMenu = ({ handleShowLogout, tokenName }) => {
  const userData = JSON.parse(Cookies.get(tokenName));
  const [showProfile, setShowProfile] = useState(false);

  // Profile Modal Handlers
  const handleShowProfile = () => {
    setShowProfile(true);
  };
  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  return (
    <>
      <Navbar.Collapse className="user-dropdown">
        <Dropdown>
          <Dropdown.Toggle id="dropdown-button-dark-example1" variant="dark">
            {userData.name}
          </Dropdown.Toggle>

          <Dropdown.Menu variant="dark" align="end">
            <Dropdown.Item onClick={handleShowProfile}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleShowLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Collapse>
      <ProfileModal
        show={showProfile}
        onHide={handleCloseProfile}
        tokenName={tokenName}
        userData={userData}
      />
    </>
  );
};

export default UserMenu;
