import React from 'react';
import { InputGroup, FormControl, ListGroup, Col, Row, Container, Button } from 'react-bootstrap';
import LeftSideNavBar from '../LeftSideNavBar';
import NavBarAfterLogin from '../NavBarAfterLogin';

function CreateGroup() {
  const name = sessionStorage.getItem('fullname');
  const email = sessionStorage.getItem('email');
  return (
    <div>
      <NavBarAfterLogin />
      <Container>
        <Row>
          <Col xs={2}>
            <LeftSideNavBar />
          </Col>
          <Col xs={8}>
            <center>
              <p>Start a new group:</p>
              <h6>My group shall be called:</h6>
              <ListGroup>
                <ListGroup.Item>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">Group Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                  </InputGroup>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h4>Group Members:</h4>
                  <p>
                    {name}({email})
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <InputGroup size="sm" className="mb-3">
                    <FormControl
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder="Name"
                    />
                    <FormControl
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder="Email"
                    />
                  </InputGroup>
                </ListGroup.Item>
              </ListGroup>
              <Button variant="success">Create Group</Button>{' '}
              <Button variant="danger">Cancel</Button>{' '}
            </center>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CreateGroup;
