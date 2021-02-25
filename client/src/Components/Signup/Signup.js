import { Component } from "react";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      authFlag: false,
    };
  }

  submitLogin(e) {
    let headers = new Headers();
    e.preventDefault();
    const data = {
      username: this.state.username,
      passowrd: this.state.password,
    };
  }

  render() {
    return (
      <div class="container">
        <p>Introduce yourself</p>
        <div class="login-form">
          <div class="main-div">
            <label>Name</label>
            <div class="form-group">
              <input type="text" class="form-control" />
            </div>
            <label>Email</label>
            <div class="form-group">
              <input type="email" class="form-control" />
            </div>
            <label>Passowrd</label>
            <div class="form-group">
              <input type="passowrd" class="form-control" />
            </div>
            <button onClick={this.submitLogin}>Sign me up!</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
