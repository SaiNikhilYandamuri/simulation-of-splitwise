import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import './MyGroups.css';

function MyGroups() {
  const [groups, getGroups] = useState([]);
  console.log('On load');
  useEffect(() => {
    axios.get('http://localhost:4000/mygroups/hello@nikhil.com').then((response) => {
      console.log(response.data);
      getGroups(response.data);
    });

    console.log(typeof groups);
  }, []);

  return (
    <div>
      <ListGroup>
        {groups.forEach((ele) => {
          <ListGroup.Item>{ele}</ListGroup.Item>;
        })}
        <ListGroup.Item>{groups[0]}</ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default MyGroups;
