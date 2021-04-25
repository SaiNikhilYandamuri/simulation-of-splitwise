import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import Select from 'react-select';
import { Redirect } from 'react-router';
import { Col, Row, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import NavBarAfterLogin from '../NavBarAfterLogin';
import LeftSideNavBar from '../LeftSideNavBar';
import backendServer from '../../Config';

function CreateGroupNew() {
  const [selectOptions, setselectOptions] = useState(() => []);
  const [groupName, setGroupName] = useState('');
  const [value, handleValueChange] = useState(() => []);
  const [alert, setAlert] = useState('');
  const isLogged = useSelector((state) => state.isLogged);
  const { email } = isLogged;
  const name = cookie.load('name'); // sessionStorage.getItem('fullname');
  const history = useHistory();
  const userId = localStorage.getItem('user_id');
  let redirectVar = null;
  // let redirectVar = null;
  if (!localStorage.getItem('token')) {
    redirectVar = <Redirect to="/login" />;
  }
  // const email = cookie.load('email');
  const createGroup = () => {
    // const formDetails = [sessionStorage.getItem('email'), form];
    const groupDetails = {
      groupName,
      email,
      value,
    };
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .post(`${backendServer}/creategroup`, groupDetails)
      .then((response) => {
        console.log(response);
        cookie.save('groupSelected', groupName, {
          path: '/',
          httpOnly: false,
          maxAge: 90000,
        });
        // sessionStorage.setItem('groupSelected', groupName);
        history.push('/groupHomePage');
      })
      .catch((err) => {
        setAlert(err.response.data.message);
      });
  };
  useEffect(() => {
    const url = `${backendServer}/users/${userId}`;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(url)
      .then((response) => {
        const { data } = response;

        const options = data.users.map((d) => ({
          value: d.userId,
          label: d.fullname,
        }));
        setselectOptions(options);
      })
      .catch((err) => {
        console.log(err);
      });
    // getOptions();
  }, []);
  return (
    <div>
      {redirectVar}
      <div>
        <NavBarAfterLogin />
        <Row>
          <Col xs={2}>
            <LeftSideNavBar />
          </Col>
          <Col>
            <div className="container ">
              <h5>Start a new group:</h5>
              <h6>My group shall be called:</h6>
              <input
                type="text"
                className="groupName"
                name="Group Name"
                placeholder="Group Name"
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
              />
              <hr />
              <h5>GROUP MEMBERS</h5>
              <h3>Admin-{(email, name)}</h3>
              <h3>Members</h3>
              <Select
                isMulti
                options={selectOptions}
                onChange={(event) => {
                  handleValueChange(event);
                  console.log(value);
                }}
              />
              <button className="btn btn-primary mt-2" type="button" onClick={createGroup}>
                Create group
              </button>
              {alert.length > 0 && <Alert variant="danger">{alert}</Alert>}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default CreateGroupNew;
