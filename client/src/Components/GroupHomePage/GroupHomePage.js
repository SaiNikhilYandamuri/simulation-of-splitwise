import React, { useEffect, useState } from 'react';
import { Col, Row, Container, Nav, Button, ListGroup } from 'react-bootstrap';

import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import NavBarAfterLogin from '../NavBarAfterLogin';

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
      <Container>
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
              <Button variant="danger" href="">
                Add A Bill
              </Button>
            </Navbar>

            <Row>
              <ListGroup variant="flush">
                {bills.map((item) => (
                  <Row>
                    <Col>
                      <ListGroup.Item
                        variant="light"
                        href=""
                        value={item.descirption}
                        key={item.descirption}
                      >
                        {item.descirption}
                      </ListGroup.Item>
                    </Col>
                    <Col>
                      <ListGroup.Item
                        variant="light"
                        href=""
                        value={item.total_amount}
                        key={item.total_amount}
                      >
                        {item.total_amount}
                      </ListGroup.Item>
                    </Col>
                    <Col>
                      <ListGroup.Item variant="light" href="" value={item.email} key={item.email}>
                        {item.email}
                      </ListGroup.Item>
                    </Col>
                  </Row>
                ))}
              </ListGroup>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GroupHomePage;
