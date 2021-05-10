import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { useHistory } from 'react-router-dom';

function LeftSideNavBar() {
  const history = useHistory();
  const openDashboard = () => {
    history.push('/dashboard');
  };
  const openRecentActivity = () => {
    history.push('/recentActivity');
  };
  const openGroupPage = () => {
    history.push('/groupPage');
  };
  return (
    <div>
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link onClick={openDashboard}>Dashboard</Nav.Link>
        <Nav.Link onClick={openRecentActivity}>Recent Activity</Nav.Link>
        <Nav.Link onClick={openGroupPage}>Groups Dashboard</Nav.Link>
      </Nav>
    </div>
  );
}

export default LeftSideNavBar;
