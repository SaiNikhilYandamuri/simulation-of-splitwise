import { React, useState } from 'react';
import axios from 'axios';
import alert from 'alert';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { signed } from '../actions';
import NavBarBeforeLogin from './NavBarBeforeLogin';

function Signup() {
  const [email, emailChangeHandler] = useState('');
  const [password, passwordChangeHandler] = useState('');
  const [fullname, fullnameChangeHandler] = useState('');
  const history = useHistory();

  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();

  const loadSuccess = () => {
    history.push('/dashboard');
  };

  const submitSignup = (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;
    if (email.includes('@') && email.includes('.com')) {
      axios
        .post('http://localhost:4000/signup', {
          fullname,
          email,
          password,
        })
        .then((response) => {
          console.log(response);
          console.log(isLogged);
          loadSuccess();
          dispatch(signed(response.data.fullname, response.data.email));
        })
        .catch((err) => {
          alert(err.response.data.message);
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
            <Form.Text className="text-muted">Introduce Yourself</Form.Text>
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

            <Button variant="danger" type="submit" onClick={submitSignup}>
              Sign me up!
            </Button>
          </Form>
        </center>
      </Jumbotron>
    </div>
  );
}

export default Signup;
