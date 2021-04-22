import { React, useState } from 'react';
import axios from 'axios';
// import alert from 'alert';
import { Redirect } from 'react-router';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import Jumbotron from 'react-bootstrap/Jumbotron';
import { Row, Col, Alert } from 'react-bootstrap';
import { signed } from '../actions';
import NavBarBeforeLogin from './NavBarBeforeLogin';
import backendServer from '../Config';

function Signup() {
  const [email, emailChangeHandler] = useState('');
  const [password, passwordChangeHandler] = useState('');
  const [fullname, fullnameChangeHandler] = useState('');
  const [token, setToken] = useState('');
  const [alert, setAlert] = useState('');
  const history = useHistory();

  const url = `${backendServer}/signup`;

  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();

  let redirectVar = null;
  if (localStorage.getItem('token')) {
    redirectVar = <Redirect to="/dashboard" />;
  }

  const loadSuccess = () => {
    history.push('/dashboard');
  };

  const submitSignup = (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;

    if (email.includes('@') && email.includes('.com')) {
      axios
        .post(url, {
          fullname,
          email,
          password,
        })
        .then((response) => {
          console.log(response.status);
          console.log(isLogged);
          setToken(response.data.token);
          console.log(token);
          const tokenArray = response.data.token.split(' ');
          localStorage.setItem('token', response.data.token);
          console.log(tokenArray[0]);
          // eslint-disable-next-line prefer-const
          let decodedToken = jwt_decode(tokenArray[1]);
          console.log(decodedToken);
          // eslint-disable-next-line no-underscore-dangle
          localStorage.setItem('user_id', decodedToken._id);

          localStorage.setItem('email', decodedToken.email);
          localStorage.setItem('fullname', decodedToken.fullname);
          localStorage.setItem('currency', decodedToken.currency);
          dispatch(signed(decodedToken.fullname, decodedToken.email, decodedToken.currency));
          loadSuccess();
        })
        .catch((err) => {
          console.log(err);
          setAlert(err.response.data.message);
        });

    } else {
      setAlert('Email Format Wrong');
    }
  };
  return (
    <div>
      {redirectVar}
      <div>
        <NavBarBeforeLogin />
        <Row>
          <Col />
          <Col>
            <center>
              <Form>
                <Form.Text className="text-muted">
                  <h4>Introduce Yourself</h4>
                </Form.Text>
                <Form.Group controlId="formBasicName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter Full name"
                    onChange={(e) => {
                      fullnameChangeHandler(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    size="sm"
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => {
                      emailChangeHandler(e.target.value);
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    size="sm"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => {
                      passwordChangeHandler(e.target.value);
                    }}
                  />
                </Form.Group>

                <Button variant="warning" type="submit" onClick={submitSignup}>
                  Sign me up!
                </Button>
                {alert.length > 0 && <Alert variant="danger">{alert}</Alert>}
              </Form>
            </center>
          </Col>
          <Col />
        </Row>
      </div>
    </div>
  );
}

export default Signup;
