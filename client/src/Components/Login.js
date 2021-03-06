import axios from 'axios';
import { React, useState } from 'react';
import alert from 'alert';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/esm/Jumbotron';
import logged from '../actions';
import NavBarBeforeLogin from './NavBarBeforeLogin';

function Login() {
  const [email, emailChangeHandler] = useState('');
  const [password, passwordChangeHandler] = useState('');
  const history = useHistory();

  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();

  const loadSuccess = () => {
    history.push('/dashboard');
  };

  const submitLogin = (e) => {
    e.preventDefault();
    console.log('inside function');

    if (email.includes('@') && email.includes('.com')) {
      axios
        .post('http://localhost:4000/login', {
          email,
          password,
        })
        .then((response) => {
          console.log(response.status);
          console.log(isLogged);
          sessionStorage.setItem('email', response.data.email);
          sessionStorage.setItem('fullname', response.data.fullname);
          loadSuccess();
          dispatch(logged(response.data.fullname, response.data.email));
        })
        .catch((err) => {
          if (!err) alert(err.response.data.message);
        });
    } else {
      console.log('Email format wrong!');
    }
  };
  return (
    <div>
      <NavBarBeforeLogin />
      <Jumbotron>
        <center>
          <Form>
            <Form.Text className="text-muted">Welcome to Splitwise</Form.Text>

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
          </Form>
        </center>
      </Jumbotron>
    </div>
  );
}

export default Login;
