import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import './Landing.css';

const Landing = function () {
  return (
    <div>
      <Navbar bg="success" expand="lg">
        <Navbar.Brand>Splitwise</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home" />
        </Nav>
        <Button variant="success" href="./login">
          Login
        </Button>
        <Button variant="danger" href="./signup">
          Signup
        </Button>{' '}
      </Navbar>
    </div>
  );
};

export default Landing;
