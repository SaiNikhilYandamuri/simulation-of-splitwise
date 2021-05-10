import React from 'react';
import { Navbar, Button, Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function NavBarBeforeLogin() {
  const history = useHistory();
  const openLogin = () => {
    history.push('/login');
  };
  const openSignup = () => {
    history.push('/signup');
  };
  return (
    <Navbar bg="success" expand="lg">
      <Navbar.Brand href="./landing">Splitwise</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home" />
      </Nav>
      <Button variant="outline-light" onClick={openLogin} data-testid="Login">
        Login
      </Button>
      <Button variant="warning" onClick={openSignup}>
        Signup
      </Button>
    </Navbar>
  );
}

export default NavBarBeforeLogin;
