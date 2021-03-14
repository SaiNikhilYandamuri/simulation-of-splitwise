import { React } from 'react';
import { Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Landing from './Landing/Landing';
import Dashboard from './Dashboard/Dashboard';
import Profile from './Profile/Profile';
import MyGroups from './MyGroups/MyGroups';
import GroupsPage from './GroupsPage/GroupsPage';
import InviteList from './InviteList/InviteList';
import CreateGroup from './CreateGroup/CreateGroup';
import GroupHomePage from './GroupHomePage/GroupHomePage';
import RecentActivity from './RecentActivity/RecentActivity';
import CreateGroupNew from './CreateGroup/CreateGroupNew';

const Main = function () {
  return (
    <div>
      <Route exact path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/landing" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/mygroups" component={MyGroups} />
      <Route path="/groupPage" component={GroupsPage} />
      <Route path="/inviteList" component={InviteList} />
      <Route path="/createGroup" component={CreateGroup} />
      <Route path="/groupHomePage" component={GroupHomePage} />
      <Route path="/recentActivity" component={RecentActivity} />
      <Route path="/createGroupNew" component={CreateGroupNew} />
    </div>
  );
};

export default Main;
