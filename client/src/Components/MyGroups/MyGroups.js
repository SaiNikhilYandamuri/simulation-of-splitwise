import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import './MyGroups.css';
import { ListGroup, Button } from 'react-bootstrap';

function MyGroups() {
  const [groups, getGroups] = useState([]);
  // const isLogged = useSelector((state) => state.isLogged.email);
  const emailId = cookie.load('email'); // sessionStorage.getItem('email');
  const history = useHistory();

  console.log('On load');
  console.log(groups);
  useEffect(async () => {
    const getURL = `http://localhost:4000/mygroups/${emailId}`;
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
  );
}

export default MyGroups;
