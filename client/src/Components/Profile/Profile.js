import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import NavBarAfterLogin from '../NavBarAfterLogin';

function Profile() {
  const [email, getEmail] = useState('');
  const [fullname, getFullname] = useState('');
  const [phonenumber, getPhonenumber] = useState('');
  const [currency, getCurrency] = useState('');
  const [timezone, getTimeZone] = useState('');
  const [language, getLanguage] = useState('');
  const isLogged = useSelector((state) => state.isLogged);
  const emailId = isLogged.email;
  let redirectVar = null;
  if (!cookie.load('cookie')) {
    redirectVar = <Redirect to="/login" />;
  }
  useEffect(async () => {
    const getURL = `http://localhost:4000/profile/${emailId}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    getEmail(response.data.email);
    getFullname(response.data.fullname);
    getPhonenumber(response.data.phonenumber);
    getCurrency(response.data.currency);
    getTimeZone(response.data.timezone);
    getLanguage(response.data.language);
  }, []);
  return (
    <div>
      {redirectVar}
      <div>
        <NavBarAfterLogin />
        <h1>Your Account</h1>

        <Col>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Your name:</Form.Label>
                  <Form.Control size="sm" placeholder={fullname} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control size="sm" placeholder={email} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Phone Number:</Form.Label>
                  <Form.Control size="sm" placeholder={phonenumber} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Currency:</Form.Label>
                  <Form.Control size="sm" as="select" defaultValue={currency}>
                    <option>{currency}</option>
                    <option>USD</option>
                    <option>KWD</option>
                    <option>BHD</option>
                    <option>GBP</option>
                    <option>EUR</option>
                    <option>CAD</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>TimeZone:</Form.Label> <br />
                  <TimezonePicker
                    absolute={false}
                    defaultValue={timezone}
                    placeholder="Select timezone..."
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>language</Form.Label>
                  <Form.Control size="sm" placeholder={language} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col />
      </div>
    </div>
  );
}

export default Profile;
