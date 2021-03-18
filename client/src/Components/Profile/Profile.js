import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Image } from 'react-bootstrap/esm';
import numeral from 'numeral';
import { useSelector, useDispatch } from 'react-redux';
import logged from '../../actions';
import NavBarAfterLogin from '../NavBarAfterLogin';
import backendServer from '../../Config';
import './Profile.css';
// import image1 from '../assets/login_logo.png';

function Profile() {
  const [email, getEmail] = useState('');
  const [fullname, getFullname] = useState('');
  const [phonenumber, getPhonenumber] = useState('');
  const [file, setFile] = useState();
  const [currency, getCurrency] = useState('');
  const [timezone, getTimeZone] = useState('');
  const [language, getLanguage] = useState('');
  const [emailUpdate, setEmail] = useState('');
  const [fullnameUpdate, setFullname] = useState('');
  const [phonenumberUpdate, setPhonenumber] = useState('');
  const [currencyUpdate, setCurrency] = useState('');
  const [languageUpdate, setLanguage] = useState('');
  const [array, getArray] = useState([]);
  const [image, setImage] = useState('');
  const isLogged = useSelector((state) => state.isLogged);
  const emailId = isLogged.email;

  const dispatch = useDispatch();
  const history = useHistory();

  let redirectVar = null;
  if (!cookie.load('cookie')) {
    redirectVar = <Redirect to="/login" />;
  }
  const changeNumberLocale = (locale) => {
    if (locale === 'GBP') {
      numeral.locale('en-gb');
    } else {
      numeral.locale('en-us');
    }
  };

  const updateProfile = () => {
    // send();

    // eslint-disable-next-line no-undef
    const data = new FormData();
    data.append('name', 'file_name.jpg');
    data.append('file', file);
    axios.post(`${backendServer}/uploadPicture/${email}`, data).then((res) => {
      console.log(res);
      setImage(`${backendServer}/${res.data.imagepath}`);
    });
    axios
      .post(`${backendServer}/updateProfile`, {
        emailId,
        emailUpdate,
        fullnameUpdate,
        phonenumberUpdate,
        currencyUpdate,
        languageUpdate,
      })
      .then((response) => {
        console.log(response);

        let fullnameCookie = '';
        if (fullnameUpdate === '') {
          fullnameCookie = fullname;
        } else {
          fullnameCookie = fullnameUpdate;
        }
        let emailCookie = '';
        if (emailUpdate === '') {
          emailCookie = email;
        } else {
          emailCookie = emailUpdate;
        }
        console.log(currencyUpdate);
        let currencyCookie = '';
        if (currencyUpdate === '') {
          currencyCookie = currency;
        } else {
          currencyCookie = currencyUpdate;
        }
        cookie.save('name', fullnameCookie, {
          path: '/',
          httpOnly: false,
          maxAge: 90000,
        });
        cookie.save('currency', currencyCookie, {
          path: '/',
          httpOnly: false,
          maxAge: 90000,
        });
        console.log(currencyCookie);
        dispatch(logged(fullnameCookie, emailCookie, currencyCookie));
        history.push('/profile');
      });
  };

  useEffect(async () => {
    const getURL = `${backendServer}/profile/${emailId}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    const arrayCurrency = [];
    if (response.data.currency === 'GBP') {
      arrayCurrency.push('GBP');
      arrayCurrency.push('USD');
    } else {
      arrayCurrency.push('USD');
      arrayCurrency.push('GBP');
    }
    setImage(`${backendServer}/${response.data.image}`);
    getEmail(response.data.email);
    getFullname(response.data.fullname);
    getPhonenumber(response.data.phonenumber);
    getCurrency(response.data.currency);
    getArray(arrayCurrency);
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
            <Image className="main myImage" src={image} />
            <input
              type="file"
              id="file"
              accept=".jpg"
              onChange={(event) => {
                setFile(event.target.files[0]);
              }}
            />
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Your name:</Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder={fullname}
                    onChange={(e) => {
                      setFullname(e.currentTarget.value);
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder={email}
                    onChange={(e) => {
                      setEmail(e.currentTarget.value);
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Phone Number:</Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder={phonenumber}
                    onChange={(e) => {
                      setPhonenumber(e.currentTarget.value);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Currency:</Form.Label>
                  <Form.Control
                    size="sm"
                    as="select"
                    defaultValue={currency}
                    onChange={(e) => {
                      setCurrency(e.currentTarget.value);
                      changeNumberLocale(e.currentTarget.value);
                    }}
                  >
                    {array.map((item) => (
                      <option>{item}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>TimeZone:</Form.Label> <br />
                  <Form.Control size="sm" placeholder={timezone} readOnly />
                </Form.Group>
                <Form.Group>
                  <Form.Label>language</Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder={language}
                    onChange={(e) => {
                      setLanguage(e.currentTarget.value);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <center>
              <Button variant="primary" onClick={updateProfile}>
                Update
              </Button>
            </center>
          </Form>
        </Col>
        <Col />
      </div>
    </div>
  );
}

export default Profile;
