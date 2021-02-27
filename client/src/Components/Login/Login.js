import axios from 'axios';
import { Component, React } from 'react';
import alert from 'alert';
import '../Landing/Landing.css';

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
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert('Email format wrong!');
    }
  }

  render() {
    return (
      <div className="container">
        <div className="login_links">
          <h2>Welcome to splitwise</h2>
          <span className="align-right">
            <div className="login_links">
              <a className="login" href="/login">
                Log in
              </a>

              <a className="signup" href="/signup">
                Sign up
              </a>
            </div>
          </span>
        </div>

        <div className="login-form">
          <div className="main-div">
            <div className="form-group">
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={this.emailChangeHandler}
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="passowrd">
                Passowrd
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  onChange={this.passwordChangeHandler}
                />
              </label>
            </div>
            <button type="button" onClick={this.submitLogin}>
              Log in
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
