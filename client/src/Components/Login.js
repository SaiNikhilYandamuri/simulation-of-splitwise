import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { Redirect } from 'react-router';
// import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { Row, Col, Alert } from 'react-bootstrap';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import logged from '../actions';
import NavBarBeforeLogin from './NavBarBeforeLogin';
import backendServer from '../Config';

function Login() {
  const [email, emailChangeHandler] = useState('');
  const [password, passwordChangeHandler] = useState('');
  const [token, setToken] = useState('');
  const [alert, setAlert] = useState('');
  const history = useHistory();

  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();
  // console.log(cookie.load('cookie'));
  let redirectVar = null;
  if (localStorage.getItem('token')) {
    redirectVar = <Redirect to="/dashboard" />;
  }

  const loadSuccess = () => {
    history.push('/dashboard');
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    console.log('inside function');

    const url = `${backendServer}/login`;
    if (email.includes('@') && email.includes('.com')) {
      axios.defaults.withCredentials = true;
      await axios
        .post(url, {
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
          dispatch(logged(decodedToken.fullname, decodedToken.email, decodedToken.currency));
          loadSuccess();
        })
        .catch((err) => {
          console.log('Error');
          setAlert(err);
          // if (!err) alert(err.response.data.message);
        });
    } else {
      setAlert('Email Format Wrong');
    }
    // return <Alert variant="danger">Email Format Wrong</Alert>;
  };
  useEffect(() => {
    axios.get(`${backendServer}/login`).then((response) => {
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

                <Button
                  variant="warning"
                  type="submit"
                  onClick={submitLogin}
                  data-testid="LoginButton"
                >
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
