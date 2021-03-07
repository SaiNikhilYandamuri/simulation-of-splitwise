import React, { useEffect, useState } from 'react';
import { Col, Row, Nav, ListGroup, Modal, Button, InputGroup, FormControl } from 'react-bootstrap';

import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import NavBarAfterLogin from '../NavBarAfterLogin';
// import AddBill from '../AddBill/AddBill';
import LeftSideNavBar from '../LeftSideNavBar';

function GroupHomePage() {
  const groupName = sessionStorage.getItem('groupSelected');
  const [bills, getBills] = useState([]);
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const email = sessionStorage.getItem('email');
  const group = sessionStorage.getItem('groupSelected');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getBillsList = async () => {
    const getURL = `http://localhost:4000/getBillsOfGroup/${groupName}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getBills(response.data);
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
        getBillsList();
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
  }, []);
  return (
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

            <Modal show={show} onHide={handleClose} animation={false}>
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
            <ListGroup variant="flush">
              {bills.map((item) => (
                <ListGroup.Item>
                  {item.descirption}&nbsp;&nbsp;&nbsp;{item.total_amount}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default GroupHomePage;
