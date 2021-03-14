import React, { useEffect, useState } from 'react';
import { Col, Row, Nav, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Navbar from 'react-bootstrap/Navbar';
// import Button from 'react-bootstrap/Button';
import NavBarAfterLogin from '../NavBarAfterLogin';

import LeftSideNavBar from '../LeftSideNavBar';

function RecentActivity() {
  const [text, getText] = useState([]);
  const email = cookie.load('email');
  useEffect(async () => {
    const getURL = `http://localhost:4000/recentActivity/${email}`;
    const response = await axios.get(getURL);
    console.log(typeof response.data);
    const array = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(response.data)) {
      console.log(key);
      console.log(value);
      array.push(value);
    }
    console.log(array);
    getText(array);
  }, []);
  let redirectVar = null;
  if (!cookie.load('cookie')) {
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
              <Navbar.Brand href="./recentActivity">Recent Activity</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
            </Navbar>
            <Row>
              <Col>
                <ListGroup>
                  {text.map((item) => (
                    <ListGroup.Item>
                      {' '}
                      {item.bill_added_by} added bill {item.descirption} in group {item.group_name}{' '}
                      of amount {item.total_amount} on {item.date}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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
