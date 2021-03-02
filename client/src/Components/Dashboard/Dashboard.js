import { React } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Dashboard.css';

const Dashboard = function () {
  return (
    <div className="dashboard">
      <Navbar bg="success" expand="lg">
        <Navbar.Brand href="#home">Splitwise</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home" />
        </Nav>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="">Profile</NavDropdown.Item>

          <NavDropdown.Divider />
          <NavDropdown.Item href="">Logout</NavDropdown.Item>
        </NavDropdown>
      </Navbar>
    </div>
  );
};

export default Dashboard;
