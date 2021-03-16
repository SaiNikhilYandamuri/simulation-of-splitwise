import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Col, Row, Nav, ListGroup, Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import NavBarAfterLogin from '../NavBarAfterLogin';
import LeftSideNavBar from '../LeftSideNavBar';

function GroupHomePage() {
  const groupName = cookie.load('groupSelected'); // sessionStorage.getItem('groupSelected');
  const [bills, getBills] = useState([]);
  const [members, getMembers] = useState([]);
  const [show, setShow] = useState(false);
  const [showLG, setShowLG] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const isLogged = useSelector((state) => state.isLogged);
  const { email } = isLogged; // sessionStorage.getItem('email');
  const group = cookie.load('groupSelected');

  let redirectVar = null;
  if (!cookie.load('cookie')) {
    redirectVar = <Redirect to="/login" />;
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseLG = () => setShowLG(false);
  const handleShowLG = () => setShowLG(true);

  const getBillsList = async () => {
    const getURL = `http://localhost:4000/getBillsOfGroup/${groupName}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getBills(response.data);
  };

  const getMembersList = async () => {
    const getURL = `http://localhost:4000/getMembersOfGroup/${groupName}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getMembers(response.data);
  };
  const handleBill = (e) => {
    e.preventDefault();
    console.log('hello');
    axios
      .post('http://localhost:4000/addBill', {
        email,
        group,
        description,
        amount,
      })
      .then((response) => {
        console.log(response);
        handleClose();
        handleCloseLG();
        getBillsList();
        getMembersList();
      })
      .catch((err) => {
        if (!err) console.log(err.response);
      });
  };
  useEffect(async () => {
    const getURL = `http://localhost:4000/getBillsOfGroup/${groupName}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getBills(response.data);
    console.log(typeof bills);
    getMembersList();
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
          <Col xs={8}>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="./groupHomePage">{groupName}</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
              <Button variant="primary" onClick={handleShow}>
                Add Bill
              </Button>
              <Modal className="addbill" show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Bill</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Bill Name"
                      aria-label="Bill Name"
                      aria-describedby="basic-addon1"
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Amount"
                      aria-label="Amount"
                      aria-describedby="basic-addon1"
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                    />
                  </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleBill}>
                    Add Bill
                  </Button>
                </Modal.Footer>
              </Modal>
            </Navbar>

            <Row>
              <Col>
                <ListGroup variant="flush">
                  {bills.map((item) => (
                    <ListGroup.Item>
                      <Row>
                        <Col>Bill Name: {item.descirption}</Col>
                        <Col>Bill Amount: ${item.total_amount}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
              <Col>
                <ListGroup variant="flush">
                  {members.map((item) => (
                    <ListGroup.Item>{item.email}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col>
            <div>
              <Navbar bg="light" expand="lg">
                <Button variant="warning" onClick={handleShowLG}>
                  Leave Group
                </Button>
                <Modal show={showLG} onHide={handleCloseLG} animation={false}>
                  <Modal.Header closeButton>
                    <Modal.Title>Leave Group</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Do you wish to leave the group?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseLG}>
                      No
                    </Button>
                    <Button variant="primary">Yes</Button>
                  </Modal.Footer>
                </Modal>
              </Navbar>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default GroupHomePage;
