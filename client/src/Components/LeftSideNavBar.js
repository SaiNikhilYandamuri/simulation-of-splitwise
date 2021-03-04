import React from 'react';
import Nav from 'react-bootstrap/Nav';
import MyGroups from './MyGroups/MyGroups';

function LeftSideNavBar() {
  return (
    <div>
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        <Nav.Link href="/dashboard">Recent Activity</Nav.Link>
      </Nav>
      <MyGroups />
    </div>
  );
}

export default LeftSideNavBar;
