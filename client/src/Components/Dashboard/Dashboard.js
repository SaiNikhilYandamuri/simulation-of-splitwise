import { React } from 'react';
import './Dashboard.css';
import { Col, Row, Nav } from 'react-bootstrap';

import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavBarAfterLogin from '../NavBarAfterLogin';

import LeftSideNavBar from '../LeftSideNavBar';

const Dashboard = function () {
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
              <Navbar.Brand href="./landing">Dashboard</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
              <Button variant="danger" href="./createGroup">
                Create a group
              </Button>
              <Button variant="success" href="./dashboard">
                Settle Up
              </Button>{' '}
            </Navbar>
            <Row>
              <Col>
                <p>Total Balance:</p>
              </Col>
              <Col>
                <p>You owe:</p>
              </Col>
              <Col>
                <p>You are owed:</p>
              </Col>
            </Row>
            <Row>
              <Col>You owe People:</Col>
              <Col>You are owed:</Col>
            </Row>
          </Col>
          <Col>3 of 3</Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
