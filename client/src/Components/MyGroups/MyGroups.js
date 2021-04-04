import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import Select from 'react-select';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './MyGroups.css';
import { ListGroup, Button, Row, Col } from 'react-bootstrap';
import backendServer from '../../Config';

function MyGroups() {
  const [groups, getGroups] = useState([]);
  const [selectGroups, setselectGroups] = useState(() => []);
  const [value, handleValueChange] = useState(() => []);
  const isLogged = useSelector((state) => state.isLogged);
  const emailId = isLogged.email; // sessionStorage.getItem('email');
  const history = useHistory();
  const userid = localStorage.getItem('user_id');

  let redirectVar = null;
  if (!localStorage.getItem('token')) {
    redirectVar = <Redirect to="/login" />;
  }

  console.log('On load');
  console.log(groups);
  useEffect(async () => {
    console.log(emailId);
    const getURL = `${backendServer}/mygroups/${userid}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getGroups(response.data);
    const { data } = response;
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
      array.push({ value: data[i], label: data[i] });
    }
    /* const options = data.map((d) => ({
      value: d.group_name,
      label: d.email,
    })); */
    setselectGroups(array);
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

  const openGroupDetailsSearch = () => {
    console.log(value.label);
    cookie.save('groupSelected', value.label, {
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
        <Row>
          <Col xs={9}>
            <Select
              options={selectGroups}
              onChange={(event) => {
                handleValueChange(event);
                console.log(event);
                console.log(value);
              }}
            />
          </Col>
          <Col>
            <Button onClick={openGroupDetailsSearch}>Go to</Button>
          </Col>
        </Row>
        <Row>
          <Col>
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
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default MyGroups;
