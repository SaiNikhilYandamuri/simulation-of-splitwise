import React from 'react';
import { Redirect } from 'react-router';
// import cookie from 'react-cookies';
import { Image } from 'react-bootstrap/esm';
import { Row, Col } from 'react-bootstrap';
// import { useHistory } from 'react-router-dom';
import './Landing.css';
import NavBarBeforeLogin from '../NavBarBeforeLogin';
import image1 from '../assets/login_logo.png';

const Landing = function () {
  let redirectVar = null;
  // const history = useHistory();
  if (!localStorage.getItem('token')) {
    // history.push('/landing');
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
              <Image className="main myImage" src={image1} />
            </center>
          </Col>
          <Col />
        </Row>
      </div>
    </div>
  );
};

export default Landing;
