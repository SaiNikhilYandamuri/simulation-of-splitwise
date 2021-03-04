import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyGroups.css';
import { ListGroup } from 'react-bootstrap';

function MyGroups() {
  const [groups, getGroups] = useState([]);
  console.log('On load');
  console.log(groups);
  useEffect(async () => {
    const response = await axios.get('http://localhost:4000/mygroups/hello@nikhil.com');
    console.log(response.data);
    getGroups(response.data);
  }, []);

  return (
    <div>
      <ListGroup variant="flush">
        {groups.map((item) => (
          <ListGroup.Item href="./group/{item}" key={item}>
            {item}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default MyGroups;
