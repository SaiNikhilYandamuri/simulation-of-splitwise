import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useSelector } from 'react-redux';

import { ListGroup, Button } from 'react-bootstrap';

function InviteList() {
  const [groups, getGroups] = useState([]);
  // const isLogged = useSelector((state) => state.isLogged.email);
  const emailId = sessionStorage.getItem('email');
  console.log('On load');
  console.log(groups);
  useEffect(async () => {
    const getURL = `http://localhost:4000/invitegroups/${emailId}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getGroups(response.data);
  }, []);

  return (
    <div>
      <ListGroup variant="flush">
        {groups.map((item) => (
          <Button variant="light" href="" value={item} key={item}>
            {item}
          </Button>
        ))}
      </ListGroup>
    </div>
  );
}

export default InviteList;
