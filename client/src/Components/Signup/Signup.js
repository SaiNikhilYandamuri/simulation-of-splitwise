import { Component, React } from 'react';
import axios from 'axios';
import alert from 'alert';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';

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
    let redirectVar = null;
    if (cookie.load('cookie')) {
      console.log('Hello');
      redirectVar = <Redirect to="/dashboard" />;
    }
    return (
      <div>
        {redirectVar}
        <div className="container">
          <div className="login_links">
            <h3>Introduce yourself</h3>
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
                <label htmlFor="fullname">
                  Name
                  <input
                    type="text"
                    className="form-control"
                    name="fullname"
                    onChange={this.fullnameChangeHandler}
                    pattern="[A-Za-z\s]{1,32}"
                    required
                  />
                </label>
              </div>

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
                    required
                  />
                </label>
              </div>
              <button type="button" onClick={this.submitSignup}>
                Sign me up!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
