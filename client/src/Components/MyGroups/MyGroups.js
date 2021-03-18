import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './MyGroups.css';
import { ListGroup, Button } from 'react-bootstrap';
import backendServer from '../../Config';

function MyGroups() {
  const [groups, getGroups] = useState([]);
  const isLogged = useSelector((state) => state.isLogged);
  const emailId = isLogged.email; // sessionStorage.getItem('email');
  const history = useHistory();

  let redirectVar = null;
  if (!cookie.load('cookie')) {
    redirectVar = <Redirect to="/login" />;
  }

  console.log('On load');
  console.log(groups);
  useEffect(async () => {
    const getURL = `${backendServer}/mygroups/${emailId}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getGroups(response.data);
  }, []);

  const openGroupDetails = (groupSelected) => {
    cookie.save('groupSelected', groupSelected, {
      path: '/',
      httpOnly: false,
      maxAge: 90000,
    });
    // sessionStorage.setItem('groupSelected', groupSelected);
    history.push('/groupHomePage');
  };

  return (
    <div>
      {redirectVar}
      <div>
        <ListGroup variant="flush">
          {groups.map((item) => (
            <Button
              variant="light"
              href=""
              value={item}
              onClick={(e) => openGroupDetails(e.currentTarget.value)}
              key={item}
            >
              {item}
            </Button>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}

export default MyGroups;
