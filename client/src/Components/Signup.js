import { React, useState } from 'react';
// import axios from 'axios';
import { useMutation } from 'react-apollo';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import Jumbotron from 'react-bootstrap/Jumbotron';
import { Row, Col, Alert } from 'react-bootstrap';
import { signed } from '../actions';
import NavBarBeforeLogin from './NavBarBeforeLogin';
// import backendServer from '../Config';
import { signupQuery } from '../graphql/mutation';

function Signup() {
  const [email, emailChangeHandler] = useState('');
  const [password, passwordChangeHandler] = useState('');
  const [fullname, fullnameChangeHandler] = useState('');
  const [alert, setAlert] = useState('');
  const history = useHistory();
  const [signup, { data }] = useMutation(signupQuery);

  // const url = `${backendServer}/signup`;

  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();

  let redirectVar = null;
  if (cookie.load('cookie')) {
    redirectVar = <Redirect to="/dashboard" />;
  }

  const loadSuccess = () => {
    history.push('/dashboard');
  };

  const submitSignup = (e) => {
    e.preventDefault();

    signup({
      variables: {
        email,
        password,
        fullname,
      },
    });

    if (data) {
      console.log(data);
      console.log(isLogged);
      cookie.save('name', data.signup.fullname, {
        path: '/',
        httpOnly: false,
        maxAge: 90000,
      });
      cookie.save('email', data.signup.email, {
        path: '/',
        httpOnly: false,
        maxAge: 90000,
      });
      sessionStorage.setItem('email', data.signup.email);
      sessionStorage.setItem('fullname', data.signup.fullname);
      dispatch(signed(data.signup.fullname, data.signup.email));
      loadSuccess();
      setAlert('Successful');
    }

    // axios.defaults.withCredentials = true;
    // if (email.includes('@') && email.includes('.com')) {
    //   axios
    //     .post(url, {
    //       fullname,
    //       email,
    //       password,
    //     })
    //     .then((response) => {
    //       console.log(response);
    //       console.log(isLogged);
    //       cookie.save('name', response.data.fullname, {
    //         path: '/',
    //         httpOnly: false,
    //         maxAge: 90000,
    //       });
    //       cookie.save('email', response.data.email, {
    //         path: '/',
    //         httpOnly: false,
    //         maxAge: 90000,
    //       });
    //       sessionStorage.setItem('email', response.data.email);
    //       sessionStorage.setItem('fullname', response.data.fullname);
    //       loadSuccess();
    //       dispatch(signed(response.data.fullname, response.data.email));
    //     })
    //     .catch((err) => {
    //       setAlert(err.response.data.message);
    //     });
    // } else {
    //   setAlert('Email Format Wrong');
    // }
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
