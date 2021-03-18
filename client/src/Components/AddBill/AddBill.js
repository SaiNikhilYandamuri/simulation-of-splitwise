import React, { useState } from 'react';
import cookie from 'react-cookies';
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import backendServer from '../../Config';

function AddBill() {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const isLogged = useSelector((state) => state.isLogged);
  const { email } = isLogged;
  // const email = cookie.load('name'); // sessionStorage.getItem('email');
  const group = cookie.load('groupSelected'); // sessionStorage.getItem('groupSelected');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleBill = (e) => {
    e.preventDefault();
    console.log('hello');
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
      })
      .catch((err) => {
        if (!err) console.log(err.response);
      });
  };
  console.log(isLogged);

  return (
    <>
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
    </>
  );
}

export default AddBill;
