import { Component } from "react";
import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="dashboard">
        <div class="dashboard header">
          <div class="topbar">
            <h1>Dashboard</h1>
            <div class="actions">
              <a class="button-expense" data-toggle="modal" href="#add_bill">
                Add an expense
              </a>
              <a
                class="button-settleup"
                data-toggle="modal"
                href="#settle_up_form"
              >
                Settle up
              </a>
            </div>
          </div>
        </div>
        <div class="total_balances">
          <div class="block">
            <div class="title">total balance</div>

            <span class="negative"></span>
          </div>
          <div class="block">
            <div class="title">you owe</div>
            <span class="negative"></span>
          </div>
          <div class="block">
            <div class="title">you are owed</div>
            <span class="neutral"></span>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
