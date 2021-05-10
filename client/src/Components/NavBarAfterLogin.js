import React from 'react';
// import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import cookie from 'react-cookies';
import Navbar from 'react-bootstrap/Navbar';
import { useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logout } from '../actions';

function NavBarAfterLogin() {
  const isLogged = useSelector((state) => state.isLogged);
  const fullanme = isLogged.username; // cookie.load('name'); // sessionStorage.getItem('fullname');
  const history = useHistory();
  const openProfile = () => {
    history.push('/profile');
  };

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

  const openLogout = () => {
    deleteStore();
    history.push('/landing');
  };

  const openDashboard = () => {
    history.push('/dashboard');
  };

  return (
    <div>
      <Navbar bg="success" expand="lg">
        <Navbar.Brand onClick={openDashboard} data-testid="Splitwise">
          Splitwise
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home" />
        </Nav>
        <NavDropdown title={fullanme} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={openProfile}>Profile</NavDropdown.Item>

          <NavDropdown.Divider />
          <NavDropdown.Item onClick={openLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Navbar>
    </div>
  );
}

export default NavBarAfterLogin;
