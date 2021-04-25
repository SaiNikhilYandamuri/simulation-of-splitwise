import { React, useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Col, Row, Nav, ListGroup, Modal, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import { useSelector } from 'react-redux';
import numeral from 'numeral';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavBarAfterLogin from '../NavBarAfterLogin';
import LeftSideNavBar from '../LeftSideNavBar';
import backendServer from '../../Config';
import 'numeral/locales/en-gb';

const Dashboard = function () {
  const [transactionsOwing, getTransactionsOwing] = useState([]);
  const [transactionsOwed, getTransactionsOwed] = useState([]);
  const [friendsDetails, getFriendsDetails] = useState([]);
  const [alertOwe, setAlertOwe] = useState('');
  const [alertOwed, setAlertOwed] = useState('');
  const [totalBalance, getTotalBalance] = useState(0.0);
  const [oweBalance, getOweBalance] = useState(0.0);
  const [owedBalance, getOwedBalance] = useState(0.0);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const isLogged = useSelector((state) => state.isLogged);
  const currency = cookie.load('currency');
  // const email = cookie.load('email');
  const handleShow = () => setShow(true);
  const userId = localStorage.getItem('user_id');
  const fullname = isLogged.username;

  let redirectVar = null;
  if (!localStorage.getItem('token')) {
    redirectVar = <Redirect to="/login" />;
  }

  const doEverything = async () => {
    numeral.defaultFormat('$0,0.00');
    if (currency === 'GBP') {
      numeral.locale('en-gb');
    }
    const getURL = `${backendServer}/dashboard/${userId}`;
    // const response = await axios.get(getURL);
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(getURL)
      .then((response) => {
        const { data } = response;
        const owed = [];
        const owing = [];
        const friends = new Map();
        const arrayFriends = [];
        data.forEach((ele) => {
          if (ele.user_1 === fullname) {
            friends.set(ele.user_2, 0);
          } else {
            friends.set(ele.user_1, 0);
          }
        });
        data.forEach((ele) => {
          if (ele.user_1 === fullname) {
            const amount = friends.get(ele.user_2) + ele.final_amount;
            friends.set(ele.user_2, amount);
          } else {
            const amount = friends.get(ele.user_1) - ele.final_amount;
            friends.set(ele.user_1, amount);
          }
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of friends.entries()) {
          if (value !== 0) {
            arrayFriends.push({ user: key, amount: value });
          }

          if (value > 0) {
            owed.push({ user: key, final_amount: value });
          } else if (value < 0) {
            owing.push({ user: key, final_amount: value });
          }
        }
        if (owing.length === 0) {
          setAlertOwe('You owe no one money');
        }
        if (owed.length === 0) {
          setAlertOwed('No one owes you money');
        }
        getTransactionsOwing(owing);
        getTransactionsOwed(owed);
        getFriendsDetails(arrayFriends);
        let owedValue = 0;
        owed.forEach((ele) => {
          owedValue += ele.final_amount;
        });
        getOwedBalance(owedValue);
        let oweValue = 0;
        owing.forEach((ele) => {
          oweValue += ele.final_amount;
        });
        getOweBalance(oweValue);
        getTotalBalance(owedValue + oweValue);
      })
      .catch((err) => {
        console.log(err.response);
      });
    // eslint-disable-next-line no-plusplus
  };
  const settleUp = (friendSelected) => {
    let settleUpValue = 0;
    friendsDetails.forEach((ele) => {
      if (ele.user === friendSelected) {
        settleUpValue = ele.amount;
      }
    });
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .post(`${backendServer}/settleUp/`, {
        userId,
        friendSelected,
        settleUpValue,
      })
      .then((response) => {
        console.log(response);
        handleClose();
        doEverything();
      });
  };

  useEffect(() => {
    doEverything();
  }, []);
  return (
    <div>
      {redirectVar}

      <div className="dashboard">
        <NavBarAfterLogin />

        <Row>
          <Col xs={2}>
            <LeftSideNavBar />
          </Col>
          <Col xs={8}>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="./dashboard" data-testid="Dashboard">
                Dashboard
              </Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
              <Button variant="danger" href="./createGroupNew">
                Create a group
              </Button>
              <Button variant="success" href="" onClick={handleShow}>
                Settle Up
              </Button>
              <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Settle Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ListGroup variant="flush">
                    {friendsDetails.map((ele) => (
                      <Button
                        variant="light"
                        href=""
                        value={ele.user}
                        onClick={(e) => settleUp(e.currentTarget.value)}
                        key={ele}
                      >
                        {ele.user}
                      </Button>
                    ))}
                  </ListGroup>
                </Modal.Body>
              </Modal>
            </Navbar>
            <Row>
              <Col>
                <p>Total Balance: {numeral(totalBalance).format()}</p>
              </Col>
              <Col>
                <p>Amount you owe: {numeral(oweBalance).format()}</p>
              </Col>
              <Col>
                <p>Amount you are owed: {numeral(owedBalance).format()}</p>
              </Col>
            </Row>
            <Row>
              <Col>People you owe:</Col>
              <Col>People who owe you:</Col>
            </Row>
            <Row>
              <Col>
                {transactionsOwing.map((transaction) => (
                  <ListGroup.Item>
                    {transaction.user} : {numeral(transaction.final_amount).format()}
                  </ListGroup.Item>
                ))}
                {alertOwe.length > 0 && <Alert variant="light">{alertOwe}</Alert>}
              </Col>
              <Col>
                {transactionsOwed.map((transaction) => (
                  <ListGroup.Item>
                    {transaction.user} : {numeral(transaction.final_amount).format()}
                  </ListGroup.Item>
                ))}
                {alertOwed.length > 0 && <Alert variant="light">{alertOwed}</Alert>}
              </Col>
            </Row>
          </Col>
          <Col />
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
