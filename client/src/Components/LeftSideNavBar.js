import React from 'react';
import Nav from 'react-bootstrap/Nav';

function LeftSideNavBar() {
  return (
    <div>
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        <Nav.Link href="/dashboard">Recent Activity</Nav.Link>
        <Nav.Link href="/groupPage">Groups Dashboard</Nav.Link>
      </Nav>
    </div>
  );
}

export default LeftSideNavBar;
