import React from 'react';
// import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import cookie from 'react-cookies';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logout } from '../actions';

function NavBarAfterLogin() {
  const isLogged = useSelector((state) => state.isLogged);
  const fullanme = isLogged.username; // cookie.load('name'); // sessionStorage.getItem('fullname');

  const dispatch = useDispatch();
  const deleteStore = () => {
    dispatch(logout('', '', ''));
    cookie.remove('email');
    cookie.remove('name');
    cookie.remove('userid');
    cookie.remove('cookie');
    cookie.remove('groupSelected');
    localStorage.removeItem('token');
  };

  return (
    <div>
      <Navbar bg="success" expand="lg">
        <Navbar.Brand href="/dashboard" data-testid="Splitwise">
          Splitwise
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home" />
        </Nav>
        <NavDropdown title={fullanme} id="basic-nav-dropdown">
          <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>

          <NavDropdown.Divider />
          <NavDropdown.Item href="/landing" onClick={deleteStore}>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Navbar>
    </div>
  );
}

export default NavBarAfterLogin;
