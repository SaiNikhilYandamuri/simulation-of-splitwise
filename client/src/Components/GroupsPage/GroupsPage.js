import React from 'react';
import { Col, Row, Nav, Button } from 'react-bootstrap';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Navbar from 'react-bootstrap/Navbar';
import NavBarAfterLogin from '../NavBarAfterLogin';
import LeftSideNavBar from '../LeftSideNavBar';
import MyGroups from '../MyGroups/MyGroups';
import InviteList from '../InviteList/InviteList';

function GroupsPage() {
  let redirectVar = null;
  if (!cookie.load('cookie')) {
    redirectVar = <Redirect to="/login" />;
  }
  return (
    <div>
      {redirectVar}

      <div>
        <NavBarAfterLogin />

        <Row>
          <Col xs={2}>
            <LeftSideNavBar />
          </Col>
          <Col xs={8}>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="./groupPage">My Groups</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
              <Button variant="danger" href="./createGroup">
                Create a group
              </Button>
            </Navbar>
            <Row>
              <Col>Groups List:</Col>
              <Col>
                <p>Invite List:</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <MyGroups />
              </Col>
              <Col>
                <InviteList />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default GroupsPage;
