import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';

function NavBarBeforeLogin() {
  return (
    <Navbar bg="success" expand="lg">
      <Navbar.Brand href="./landing">Splitwise</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home" />
      </Nav>
      <Button variant="outline-light" href="./login">
        Login
      </Button>
      <Button variant="warning" href="./signup">
        Signup
      </Button>
    </Navbar>
  );
}

export default NavBarBeforeLogin;
