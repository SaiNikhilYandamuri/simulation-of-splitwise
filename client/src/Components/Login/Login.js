import { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div class="container">
        <h2>Welcome to splitwise</h2>
        <div class="login-form">
          <div class="main-div">
            <label>Email</label>
            <div class="form-group">
              <input type="email" class="form-control" />
            </div>
            <label>Passowrd</label>
            <div class="form-group">
              <input type="passowrd" class="form-control" />
            </div>
            <button>Log in</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
