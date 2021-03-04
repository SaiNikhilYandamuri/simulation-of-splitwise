import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import NavBarAfterLogin from '../NavBarAfterLogin';

function Profile() {
  return (
    <div>
      <NavBarAfterLogin />
      <h1>Your Account</h1>
      <Form>
        <Row>
          <Col>
            <Form.Label>Your name:</Form.Label>
            <Form.Control />
          </Col>
          <Col>
            <Form.Control placeholder="Last name" />
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Profile;
