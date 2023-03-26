import React from "react";
// Bootstrap
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
// CSS
import "./layoutsCSS/UserMenu.css";

const UserMenu = ({ handleShowLogout, handleShowProfile, tokenName }) => {
  const userData = JSON.parse(localStorage.getItem(tokenName));

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
    </>
  );
};

export default UserMenu;
