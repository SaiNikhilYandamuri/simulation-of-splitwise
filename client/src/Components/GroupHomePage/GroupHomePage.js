import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Col, Row, Nav, ListGroup, Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import alert from 'alert';
import numeral from 'numeral';
import Navbar from 'react-bootstrap/Navbar';
import NavBarAfterLogin from '../NavBarAfterLogin';
import LeftSideNavBar from '../LeftSideNavBar';
import 'numeral/locales/en-gb';
import backendServer from '../../Config';

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
  const { currency } = isLogged;
  const history = useHistory();

  let redirectVar = null;
  if (!cookie.load('cookie')) {
    redirectVar = <Redirect to="/login" />;
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseLG = () => setShowLG(false);
  const handleShowLG = () => setShowLG(true);

  const getBillsList = async () => {
    const getURL = `${backendServer}/getBillsOfGroup/${groupName}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getBills(response.data);
  };

  const getMembersList = async () => {
    const getURL = `${backendServer}/getMembersOfGroup/${groupName}&${email}`;
    console.log(email);
    axios.get(getURL).then((response) => {
      console.log(response);
      const friends = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(response.data)) {
        console.log(key);
        if (value.user_1 === email) {
          if (value.final_amount < 0) {
            const neagtive = value.final_amount * -1;
            friends.push({ name: value.user_2, amount: neagtive });
          } else {
            friends.push({ name: value.user_2, amount: value.final_amount });
          }
        } else if (value.final_amount < 0) {
          const neagtive = value.final_amount * -1;
          friends.push({ name: value.user_1, amount: neagtive });
        } else {
          friends.push({ name: value.user_1, amount: value.final_amount });
        }
      }
      getMembers(friends);
      // getMembers(response.data);
    });
    /* const response = await axios.get(getURL, {
      email,
    }); */
    // console.log(response.data);
  };
  const leaveGroup = () => {
    let sum = 0;
    members.forEach((ele) => {
      console.log(ele);
      sum += ele.amount;
    });
    console.log(sum);
    if (sum !== 0) {
      alert('Not possible to leave the group');
    } else {
      axios
        .post(`${backendServer}/leaveGroup`, {
          groupName,
          email,
        })
        .then((response1) => {
          console.log(response1.data);
          history.push('/groupPage');
        });
    }
  };
  const handleBill = (e) => {
    e.preventDefault();

    if (Number.parseFloat(amount)) {
      axios
        .post(`${backendServer}/addBill`, {
          email,
          group,
          description,
          amount,
        })
        .then((response) => {
          console.log(response);
          handleClose();
          // handleCloseLG();
          getBillsList();
          getMembersList();
          history.push('/groupHomePage');
        })
        .catch((err) => {
          if (!err) console.log(err.response);
        });
    } else {
      alert('The aount entered is not in proper format');
    }
  };
  useEffect(async () => {
    const getURL = `${backendServer}/getBillsOfGroup/${groupName}`;
    const response = await axios.get(getURL);
    numeral.defaultFormat('$0,0.00');
    console.log(currency);
    if (currency === 'GBP') {
      numeral.locale('en-gb');
    }
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
          <Col>
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
                  <Button variant="primary" onClick={leaveGroup}>
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Navbar>

            <Row>
              <Col xs={8}>
                <ListGroup variant="flush">
                  {bills.map((item) => (
                    <ListGroup.Item>
                      <Row>
                        <Col>Bill Name: {item.descirption}</Col>
                        <Col>Bill Amount: {numeral(item.total_amount).format()}</Col>
                        <Col>Added by: {item.email}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
              <Col>
                <ListGroup variant="flush">
                  {members.map((item) => (
                    <ListGroup.Item>
                      <Col>Member: {item.name}</Col>
                      <Col>Amount: {item.amount}</Col>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <Col>And You:</Col>
                    <Col>{email}</Col>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Col>
          {/* <Col>
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
          </Col> */}
        </Row>
      </div>
    </div>
  );
}

export default GroupHomePage;
