import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Main from "./Components/Main";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }

  callApi() {
    fetch("http://localhost:4000")
      .then((res) => res.text())
      .then((res) => this.setState({ message: res }))
      .catch((err) => err);
  }

  componentDidMount() {
    this.callApi();
  }

  render() {
    return (
      <BrowserRouter>
        <div>{<Main />}</div>
      </BrowserRouter>
    );
  }
}

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/
export default App;
