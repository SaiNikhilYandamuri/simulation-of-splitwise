import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { Row, Col, Alert } from 'react-bootstrap';
import logged from '../actions';
import NavBarBeforeLogin from './NavBarBeforeLogin';

function Login() {
  const [email, emailChangeHandler] = useState('');
  const [password, passwordChangeHandler] = useState('');
  const [alert, setAlert] = useState('');
  const history = useHistory();

  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();
  console.log(cookie.load('cookie'));
  let redirectVar = null;
  if (cookie.load('cookie')) {
    redirectVar = <Redirect to="/dashboard" />;
  }

  const loadSuccess = () => {
    history.push('/dashboard');
  };

  const submitLogin = (e) => {
    e.preventDefault();
    console.log('inside function');

    if (email.includes('@') && email.includes('.com')) {
      axios.defaults.withCredentials = true;
      axios
        .post('http://localhost:4000/login', {
          email,
          password,
        })
        .then((response) => {
          console.log(response.status);
          console.log(isLogged);
          cookie.save('name', response.data.fullname, {
            path: '/',
            httpOnly: false,
            maxAge: 90000,
          });
          cookie.save('email', response.data.email, {
            path: '/',
            httpOnly: false,
            maxAge: 90000,
          });
          sessionStorage.setItem('email', response.data.email);
          sessionStorage.setItem('fullname', response.data.fullname);
          loadSuccess();
          dispatch(logged(response.data.fullname, response.data.email, response.data.currency));
        })
        .catch((err) => {
          setAlert(err.response.data.message);
          // if (!err) alert(err.response.data.message);
        });
    } else {
      setAlert('Email Format Wrong');
    }
    // return <Alert variant="danger">Email Format Wrong</Alert>;
  };
  useEffect(() => {
    axios.get('http://localhost:4000/login').then((response) => {
      if (response.data.loggedIn === true) {
        console.log(response);
      }
    });
  }, []);

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
                  <h4>Welcome to Splitwise</h4>
                </Form.Text>

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

                <Button variant="warning" type="submit" onClick={submitLogin}>
                  Log in
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

export default Login;
