import { Component } from "react";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="container">
        <h2>Dashboard</h2>
        <div class="dashboard-page"></div>
      </div>
    );
  }
}

export default Dashboard;
