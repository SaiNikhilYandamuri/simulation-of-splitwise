import React, { useEffect, useState } from 'react';
import { Col, Row, Nav, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router';
// import cookie from 'react-cookies';
import Navbar from 'react-bootstrap/Navbar';
// import Button from 'react-bootstrap/Button';
import NavBarAfterLogin from '../NavBarAfterLogin';
import backendServer from '../../Config';
import LeftSideNavBar from '../LeftSideNavBar';

function RecentActivity() {
  const [text, getText] = useState([]);
  const [alert, setAlert] = useState('');
  // const email = cookie.load('email');
  const userId = localStorage.getItem('user_id');
  useEffect(async () => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const getURL = `${backendServer}/recentActivity/${userId}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    const array = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(response.data)) {
      console.log(key);
      console.log(value);
      array.push(value);
    }
    console.log(response.data);
    if (array.length === 0) {
      setAlert('No recent activity to show');
    }
    getText(array);
  }, []);
  let redirectVar = null;
  if (!localStorage.getItem('token')) {
    redirectVar = <Redirect to="/login" />;
  }
  return (
    <div>
      {redirectVar}

      <div className="dashboard">
        <NavBarAfterLogin />

        <Row>
          <Col xs={2}>
            <LeftSideNavBar />
          </Col>
          <Col xs={8}>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="./recentActivity" data-testid="RecentActivity">
                Recent Activity
              </Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
            </Navbar>
            <Row>
              <Col>
                <ListGroup>
                  {text.map((item) => (
                    <ListGroup.Item> {item}</ListGroup.Item>
                  ))}
                </ListGroup>
                {alert.length > 0 && <Alert variant="light">{alert}</Alert>}
              </Col>
            </Row>
          </Col>
          <Col />
        </Row>
      </div>
    </div>
  );
}

export default RecentActivity;
