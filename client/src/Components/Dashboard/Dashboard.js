import { React } from 'react';
import './Dashboard.css';
import { Col, Row, Container, Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavBarAfterLogin from '../NavBarAfterLogin';

import MyGroups from '../MyGroups/MyGroups';

const Dashboard = function () {
  return (
    <div className="dashboard">
      <NavBarAfterLogin />
      <Container>
        <Row>
          <Col xs={3}>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/dashboard">Recent Activity</Nav.Link>
            </Nav>
            <MyGroups />
          </Col>
          <Col xs={8}>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="./landing">Dashboard</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
              <Button variant="danger" href="./dashboard">
                Add a Bill
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
          </Col>
          <Col>3 of 3</Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
