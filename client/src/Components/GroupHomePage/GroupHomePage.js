import React, { useEffect, useState } from 'react';
import { Col, Row, Nav, ListGroup } from 'react-bootstrap';

import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import NavBarAfterLogin from '../NavBarAfterLogin';
import AddBill from '../AddBill/AddBill';
import LeftSideNavBar from '../LeftSideNavBar';

function GroupHomePage() {
  const groupName = sessionStorage.getItem('groupSelected');
  const [bills, getBills] = useState([]);
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
            <AddBill />
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
