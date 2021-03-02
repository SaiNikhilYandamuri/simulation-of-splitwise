import axios from 'axios';
import { Component, React } from 'react';
import alert from 'alert';
import cookie from 'react-cookies';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import '../Landing/Landing.css';
import Nav from 'react-bootstrap/esm/Nav';
import Form from 'react-bootstrap/Form';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.verifyEmailAddressFormat = this.verifyEmailAddressFormat.bind(this);
  }

  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  verifyEmailAddressFormat = (email) => {
    if (email.includes('@') && email.includes('.com')) {
      return true;
    }
    return false;
  };

  submitLogin(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const data = {
      email,
      password,
    };

    if (this.verifyEmailAddressFormat(data.email)) {
      axios
        .post('http://localhost:4000/login', data)
        .then((response) => {
          console.log(response.status);
          console.log(cookie);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    } else {
      alert('Email format wrong!');
    }
  }

  render() {
    return (
      <div>
        <Navbar bg="success" expand="lg">
          <Navbar.Brand href="#home">Splitwise</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home" />
          </Nav>
          <Button variant="success" href="./login">
            Login
          </Button>
          <Button variant="danger" href="./signup">
            Signup
          </Button>{' '}
        </Navbar>
        <center>
          <Form>
            <Form.Text className="text-muted">Welcome to Splitwise</Form.Text>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                size="sm"
                type="email"
                placeholder="Enter email"
                onChange={this.emailChangeHandler}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                size="sm"
                type="password"
                placeholder="Password"
                onChange={this.passwordChangeHandler}
              />
            </Form.Group>

            <Button variant="danger" type="submit" onClick={this.submitLogin}>
              Log in
            </Button>
          </Form>
        </center>
      </div>
    );
  }
}

export default Login;
