import { React } from 'react';
import { Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Landing from './Landing/Landing';
import Dashboard from './Dashboard/Dashboard';

const Main = function () {
  return (
    <div>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/landing" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
    </div>
  );
};

export default Main;
