import React from 'react';
import { Image } from 'react-bootstrap/esm';
import { Row, Col } from 'react-bootstrap';
import './Landing.css';
import NavBarBeforeLogin from '../NavBarBeforeLogin';
import image1 from '../assets/login_logo.png';

const Landing = function () {
  return (
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
  );
};

export default Landing;
