import React from 'react';
import { Navbar, Button, Nav } from 'react-bootstrap';

function NavBarBeforeLogin() {
  return (
    <Navbar bg="success" expand="lg">
      <Navbar.Brand href="./landing">Splitwise</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home" />
      </Nav>
      <Button variant="outline-light" href="./login" data-testid="Login">
        Login
      </Button>
      <Button variant="warning" href="./signup">
        Signup
      </Button>
    </Navbar>
  );
}

export default NavBarBeforeLogin;
