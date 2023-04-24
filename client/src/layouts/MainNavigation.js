import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// Bootstrap
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Dropdown from "react-bootstrap/Dropdown";
// CSS
import "./layoutsCSS/MainNavigation.css";
import Col from "react-bootstrap/esm/Col";
// Components
import DownloadFile from "../components/DownloadFile";
import SaveFileModal from "./SaveFileModal";
import OpenFileModal from "./OpenFileModal";
// Handlers
import { useFile } from "../contexts/FileHandler";

const MainNavigation = () => {
  const [active, setActive] = useState("/");
  const [showSaveFile, setShowSaveFile] = useState(false);
  const [showOpenFile, setShowOpenFile] = useState(false);
  const { saveFile, overwriteFile, saveAsFile } = useFile();

  const handleShowSaveFile = () => setShowSaveFile(true);
  const handleCloseSaveFile = () => setShowSaveFile(false);
  const handleShowOpenFile = () => setShowOpenFile(true);
  const handleCloseOpenFile = () => setShowOpenFile(false);
  // Active tab styling
  const navLinkStyles = ({ isActive }) => {
    return {
      borderBottom: isActive ? "0" : "",
      border: isActive ? "1px solid #6e6e6e" : "",
      backgroundColor: isActive ? "#252424" : "",
      color: "#f5f5f5",
    };
  };

  const handleOverwriteFile = async () => {
    const existingFileName = overwriteFile.name;
    const userId = overwriteFile.id;
    await saveAsFile(existingFileName, userId);
  };

  return (
    <>
      <Container className="main-navigation-container">
        <Row className="align-items-center">
          <Col xs="4" sm>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-button-dark-example1"
                variant="dark"
              >
                <img
                  alt=""
                  src="images/main-logo.png"
                  width="45"
                  height="45"
                  className=""
                />
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark">
                <Dropdown.Item onClick={handleShowOpenFile}>
                  Open file
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={handleOverwriteFile}
                  disabled={!overwriteFile.name ? true : ""}
                >
                  Save
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={handleShowSaveFile}
                  disabled={
                    saveFile.audio === null || saveFile.transcript === ""
                      ? true
                      : ""
                  }
                >
                  Save file as
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col xs="4" sm="6">
            <Nav
              className="main-navigation justify-content-center"
              variant="tabs"
              defaultActiveKey="/speechtotext"
              activeKey={active}
              onSelect={(selectedKey) => setActive(selectedKey)}
            >
              <Nav.Item>
                <Nav.Link
                  as={NavLink}
                  to={"/speechtotext"}
                  style={navLinkStyles}
                >
                  Speech to text
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={NavLink}
                  to={"/texttospeech"}
                  style={navLinkStyles}
                >
                  Text to Speech
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col xs="4" sm>
            <DownloadFile />
          </Col>
        </Row>
      </Container>
      <SaveFileModal show={showSaveFile} onHide={handleCloseSaveFile} />
      <OpenFileModal show={showOpenFile} onHide={handleCloseOpenFile} />
    </>
  );
};

export default MainNavigation;
