import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
// import { useSelector, useDispatch } from 'react-redux';

function NavBarAfterLogin() {
  // const isLogged = useSelector((state) => state.isLogged.username);
  const fullanme = sessionStorage.getItem('fullname');
  const deleteStore = () => {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('fullname');
  };

  return (
    <div>
      <Navbar bg="success" expand="lg">
        <Navbar.Brand href="/dashboard">Splitwise</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home" />
        </Nav>
        <NavDropdown title={fullanme} id="basic-nav-dropdown">
          <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>

          <NavDropdown.Divider />
          <NavDropdown.Item href="./landing" onClick={deleteStore}>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Navbar>
    </div>
  );
}

export default NavBarAfterLogin;
