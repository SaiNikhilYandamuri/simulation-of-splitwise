import { Component } from "react";
import { Route } from "react-router-dom";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import Landing from "./Landing/Landing";

class Main extends Component {
  render() {
    return (
      <div>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/landing" component={Landing} />
      </div>
    );
  }
}

export default Main;
