import { React } from 'react';
import './Dashboard.css';

const Dashboard = function () {
  return (
    <div className="dashboard">
      <div className="dashboard header">
        <div className="topbar">
          <h1>Dashboard</h1>
          <div className="actions">
            <a className="button-expense" data-toggle="modal" href="#add_bill">
              Add an expense
            </a>
            <a className="button-settleup" data-toggle="modal" href="#settle_up_form">
              Settle up
            </a>
          </div>
        </div>
      </div>
      <div className="total_balances">
        <div className="block">
          <div className="title">total balance</div>

          <span className="negative" />
        </div>
        <div className="block">
          <div className="title">you owe</div>
          <span className="negative" />
        </div>
        <div className="block">
          <div className="title">you are owed</div>
          <span className="neutral" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
