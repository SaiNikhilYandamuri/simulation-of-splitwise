import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import {
  Col,
  Row,
  Nav,
  ListGroup,
  Modal,
  Button,
  InputGroup,
  FormControl,
  Accordion,
  Card,
} from 'react-bootstrap';
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
  const [comments, getCommentsFromAPI] = useState([]);
  const [comment, setComment] = useState('');
  const [billId, setBillId] = useState('');
  const [deleteCommentID, setDeleteCommentID] = useState('');
  const [members, getMembers] = useState([]);
  const [show, setShow] = useState(false);
  const [showLG, setShowLG] = useState(false);
  const [showDC, setShowDC] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const isLogged = useSelector((state) => state.isLogged);
  const { email } = isLogged; // sessionStorage.getItem('email');
  const group = cookie.load('groupSelected');
  const { currency } = isLogged;
  const history = useHistory();
  const userId = localStorage.getItem('user_id');

  let redirectVar = null;
  if (!localStorage.getItem('token')) {
    redirectVar = <Redirect to="/login" />;
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseLG = () => setShowLG(false);
  const handleShowLG = () => setShowLG(true);

  const handleCloseDC = () => setShowDC(false);
  const handleShowDC = (commentId) => {
    setDeleteCommentID(commentId);
    setShowDC(true);
  };

  const getBillsList = async () => {
    const getURL = `${backendServer}/getBillsOfGroup/${groupName}`;
    const response = await axios.get(getURL);
    getBills(response.data);
  };

  const getMembersList = async () => {
    const getURL = `${backendServer}/getMembersOfGroup/${groupName}&${userId}`;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.get(getURL).then((response) => {
      const friends = response.data;

      getMembers(friends);
    });
  };
  const leaveGroup = () => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .post(`${backendServer}/leaveGroup`, {
        groupName,
        email,
        userId,
      })
      .then((response1) => {
        console.log(response1.data);
        history.push('/groupPage');
      })
      .catch((err) => {
        console.log(err);
        alert('Not possible to leave the group');
      });
  };
  const getComments = async (billId1) => {
    setBillId(billId1);
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const getURL = `${backendServer}/getComments/${billId1}`;
    const response = await axios.get(getURL);
    getCommentsFromAPI(response.data.comments);
  };

  const addComment = (e) => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    e.preventDefault();
    axios
      .post(`${backendServer}/addComment`, {
        billId,
        userId,
        comment,
      })
      .then((response) => {
        console.log(response.data);
        getComments(billId);
        handleCloseDC();
      });
  };

  const deleteComment = () => {
    const commentId = deleteCommentID;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .post(`${backendServer}/deleteComment`, {
        billId,
        commentId,
      })
      .then((response) => {
        console.log(response.data);
        getComments(billId);
      });
  };

  const handleBill = (e) => {
    e.preventDefault();
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    if (Number.parseFloat(amount)) {
      axios
        .post(`${backendServer}/addBill`, {
          email,
          group,
          description,
          amount,
          userId,
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
    if (currency === 'GBP') {
      numeral.locale('en-gb');
    }
    getBills(response.data);
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
                <Accordion>
                  {bills.map((item) => (
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey={item.id}
                          value={item.id}
                          onClick={(e) => getComments(e.currentTarget.value)}
                        >
                          <Row>
                            <Col>Bill Name: {item.descirption}</Col>
                            <Col>Bill Amount: {numeral(item.total_amount).format()}</Col>
                            <Col>Added by: {item.email}</Col>
                          </Row>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={item.id}>
                        <Card.Body>
                          {comments.map((comment1) => (
                            <ListGroup.Item>
                              <Row>
                                <Col>Comment: {comment1.comment}</Col>
                                <Col>Added By: {comment1.user}</Col>
                                {userId === comment1.id && (
                                  <Col>
                                    <Button
                                      value={comment1.commentId}
                                      onClick={(e) => handleShowDC(e.currentTarget.value)}
                                    >
                                      X
                                    </Button>
                                    <Modal show={showDC} onHide={handleCloseDC} animation={false}>
                                      <Modal.Header closeButton>
                                        <Modal.Title>Delete Comment</Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>Do you wish to delete this comment?</Modal.Body>
                                      <Modal.Footer>
                                        <Button variant="danger" onClick={handleCloseDC}>
                                          No
                                        </Button>
                                        <Button variant="primary" onClick={deleteComment}>
                                          Yes
                                        </Button>
                                      </Modal.Footer>
                                    </Modal>
                                  </Col>
                                )}
                              </Row>
                            </ListGroup.Item>
                          ))}
                          <InputGroup>
                            <FormControl
                              placeholder="Add Comment"
                              aria-label="Add Comment"
                              aria-describedby="basic-addon2"
                              onChange={(e) => {
                                setComment(e.target.value);
                              }}
                            />
                            <InputGroup.Append>
                              <Button variant="outline-secondary" onClick={addComment}>
                                Add
                              </Button>
                            </InputGroup.Append>
                          </InputGroup>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ))}
                </Accordion>
              </Col>
              <Col>
                <ListGroup variant="flush">
                  {
                    members.map((item) => (
                      <ListGroup.Item>
                        <Col>Member: {item}</Col>
                      </ListGroup.Item>
                    ))
                    /* members.map((item) => (
                    <ListGroup.Item>
                      <Col>Member: {item.name}</Col>
                      <Col>Amount: {item.amount}</Col>
                    </ListGroup.Item>
                  )) */
                  }
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
