import axios from "axios";
import { Component } from "react";
import "../Landing/Landing.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      authFlag: false,
    };
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  componentWillMount() {
    this.setState({
      authFlag: false,
    });
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

  submitLogin(e) {
    //let headers = new Headers();
    e.preventDefault();
    const data = {
      email: this.state.email,
      passowrd: this.state.password,
    };

    //axios.defaults.withCredentials = true;
    if (this.verifyEmailAddressFormat(data.email)) {
      axios
        .post("http://localhost:4000/login", data)
        .then((response) => {
          console.log(response.status);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Email format wrong!");
    }
  }

  verifyEmailAddressFormat(email) {
    if (email.includes("@") && email.includes(".com")) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    return (
      <div class="container">
        <div class="login_links">
          <h2>Welcome to splitwise</h2>
          <span class="align-right">
            <div class="login_links">
              <a class="login" href="/login">
                Log in
              </a>

              <a class="signup" href="/signup">
                Sign up
              </a>
            </div>
          </span>
        </div>

        <div class="login-form">
          <div class="main-div">
            <label>Email</label>
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                name="email"
                onChange={this.emailChangeHandler}
                autoFocus
                required
              />
            </div>
            <label>Passowrd</label>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                name="password"
                onChange={this.passwordChangeHandler}
              />
            </div>
            <button onClick={this.submitLogin}>Log in</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
