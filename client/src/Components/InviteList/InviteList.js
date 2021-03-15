import React, { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ListGroup, Button, Modal } from 'react-bootstrap';

function InviteList() {
  const [groups, getGroups] = useState([]);
  const history = useHistory();
  const [show, setShow] = useState(false);
  // const isLogged = useSelector((state) => state.isLogged.email);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const isLogged = useSelector((state) => state.isLogged);
  const emailId = isLogged.email;
  let redirectVar = null;
  if (!cookie.load('cookie')) {
    redirectVar = <Redirect to="/login" />;
  }
  const accepetInvitation = (groupSelected) => {
    console.log(emailId);
    axios
      .post('http://localhost:4000/acceptInvite', {
        emailId,
        groupSelected,
      })
      .then((response) => {
        console.log(response);
        cookie.save('groupSelected', groupSelected, {
          path: '/',
          httpOnly: false,
          maxAge: 90000,
        });
        sessionStorage.setItem('groupSelected', groupSelected);
        history.push('/groupHomePage');
      });
  };
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
      {redirectVar}
      <div>
        <ListGroup variant="flush">
          {groups.map((item) => (
            <div>
              <Button variant="light" href="" onClick={handleShow} value={item} key={item}>
                {item}
              </Button>
              <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Accept Invitation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you wish to accpet invitation to {item} group?</Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleClose}>
                    No
                  </Button>
                  <Button
                    variant="primary"
                    value={item}
                    onClick={(e) => accepetInvitation(e.currentTarget.value)}
                  >
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
