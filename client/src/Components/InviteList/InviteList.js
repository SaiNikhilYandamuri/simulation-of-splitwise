import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ListGroup, Button, Modal } from 'react-bootstrap';
import backendServer from '../../Config';

function InviteList() {
  const [groups, getGroups] = useState([]);
  const history = useHistory();
  const [show, setShow] = useState(false);
  // const isLogged = useSelector((state) => state.isLogged.email);
  const handleClose = () => setShow(false);
  const handleShow = (groupSelected) => {
    cookie.save('groupSelectedInvite', groupSelected, {
      path: '/',
      httpOnly: false,
      maxAge: 90000,
    });
    setShow(true);
  };
  const isLogged = useSelector((state) => state.isLogged);
  const emailId = isLogged.email;
  let redirectVar = null;
  if (!cookie.load('name')) {
    redirectVar = <Redirect to="/login" />;
  }
  const accepetInvitation = () => {
    console.log(emailId);
    const groupName = cookie.load('groupSelectedInvite');
    axios
      .post(`${backendServer}/acceptInvite`, {
        emailId,
        groupName,
      })
      .then((response) => {
        console.log(response);
        cookie.save('groupSelected', groupName, {
          path: '/',
          httpOnly: false,
          maxAge: 90000,
        });
        sessionStorage.setItem('groupSelected', groupName);
        history.push('/groupHomePage');
      });
  };
  console.log('On load');
  console.log(groups);
  useEffect(async () => {
    const getURL = `${backendServer}/invitegroups/${emailId}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getGroups(response.data);
  }, []);

  return (
    <div>
      {redirectVar}
      <div>
        <ListGroup variant="flush">
          {groups.map((item) => (
            <div>
              <Button
                variant="light"
                href=""
                onClick={(e) => handleShow(e.currentTarget.value)}
                value={item}
                key={item}
              >
                {item}
              </Button>
              <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Accept Invitation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you wish to accpet invitation to group?</Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleClose}>
                    No
                  </Button>
                  <Button variant="primary" onClick={accepetInvitation}>
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}

export default InviteList;
