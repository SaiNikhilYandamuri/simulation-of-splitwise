import React from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import NavBarAfterLogin from '../NavBarAfterLogin';
import LeftSideNavBar from '../LeftSideNavBar';

function GroupPage() {
  return (
    <div>
      <NavBarAfterLogin />
      <Container>
        <Row>
          <Col xs={3}>
            <LeftSideNavBar />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GroupPage;
