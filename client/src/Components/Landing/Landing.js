import React from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import { Image } from 'react-bootstrap/esm';
import { Row, Col } from 'react-bootstrap';
import './Landing.css';
import NavBarBeforeLogin from '../NavBarBeforeLogin';
import image1 from '../assets/login_logo.png';

const Landing = function () {
  let redirectVar = null;
  if (!cookie.load('cookie')) {
    redirectVar = <Redirect to="/landing" />;
  } else {
    redirectVar = <Redirect to="/dashboard" />;
  }
  return (
    <div>
      {redirectVar}
      <div>
        <NavBarBeforeLogin />
        <Row>
          <Col />
          <Col>
            <center>
              <h3>Welcome to Splitwise</h3>
              <Image className="main" src={image1} />
            </center>
          </Col>
          <Col />
        </Row>
      </div>
    </div>
  );
};

export default Landing;
