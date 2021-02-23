import React from "react";
import "./Landing.css";

class Landing extends React.Component {
  render() {
    return (
      //React.createElement()
      <div className="nav-bar">
        <p>Splitwise</p>
        <button type="button" id="login-button" className="login-button">
          Log in
        </button>
        <button type="button" id="signup-button" className="signup-button">
          Sign Up
        </button>
      </div>
    );
  }
}

export default Landing;
