import { Component, React } from 'react';
import axios from 'axios';
import alert from 'alert';
import cookie from 'react-cookies';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Form from 'react-bootstrap/Form';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: '',
      email: '',
      password: '',
    };
    this.fullnameChangeHandler = this.fullnameChangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
    this.verifyEmailAddressFormat = this.verifyEmailAddressFormat.bind(this);
  }

  fullnameChangeHandler = (e) => {
    this.setState({
      fullname: e.target.value,
    });
  };

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

  submitSignup(e) {
    e.preventDefault();
    const { fullname, email, password } = this.state;
    const data = {
      fullname,
      email,
      password,
    };

    console.log(data);

    axios.defaults.withCredentials = true;
    if (this.verifyEmailAddressFormat(data.email)) {
      axios
        .post('http://localhost:4000/signup', data)
        .then((response) => {
          console.log(response);
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
            <Form.Text className="text-muted">Introduce Yourself</Form.Text>
            <Form.Group controlId="formBasicName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter Full name"
                onChange={this.fullnameChangeHandler}
              />
            </Form.Group>
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

            <Button variant="danger" type="submit" onClick={this.submitSignup}>
              Sign me up!
            </Button>
          </Form>
        </center>
      </div>
    );
  }
}

export default Signup;
