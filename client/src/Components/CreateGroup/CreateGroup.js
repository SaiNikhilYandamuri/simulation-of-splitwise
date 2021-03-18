import React, { useState } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import NavBarAfterLogin from '../NavBarAfterLogin';
import LeftSideNavBar from '../LeftSideNavBar';
import backendServer from '../../Config';

function CreateGroup() {
  const [form, setForm] = useState([]);
  const [groupName, setGroupName] = useState('');
  const name = cookie.load('name'); // sessionStorage.getItem('fullname');
  const email = cookie.load('email'); // sessionStorage.getItem('email');
  const history = useHistory();
  // eslint-disable-next-line prefer-const
  let members = [];
  members.push(email);

  const prevIsValid = () => {
    if (form.length === 0) {
      return true;
    }

    const someEmpty = form.some((item) => item.Email === '');

    if (someEmpty) {
      // eslint-disable-next-line array-callback-return
      form.map((item, index) => {
        const allPrev = [...form];

        if (form[index].Email === '') {
          allPrev[index].errors.Email = 'Email is required';
        }

        setForm(allPrev);
      });
    }

    return !someEmpty;
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    const inputState = {
      Email: '',

      errors: {
        Email: null,
      },
    };

    if (prevIsValid()) {
      setForm((prev) => [...prev, inputState]);
    }
  };

  const onChange = (index, event) => {
    event.preventDefault();
    event.persist();
    console.log(event.target.value);

    console.log(members);

    setForm((prev) =>
      prev.map((item, i) => {
        members.push(event.target.value);
        console.log(members);
        if (i !== index) {
          return item;
        }

        return {
          ...item,
          [event.target.name]: event.target.value,

          errors: {
            ...item.errors,
            [event.target.name]:
              event.target.value.length > 0 ? null : `${[event.target.name]} Is required`,
          },
        };
      })
    );
  };

  const handleRemoveField = (e, index) => {
    e.preventDefault();

    setForm((prev) => prev.filter((item) => item !== prev[index]));
  };

  const createGroup = () => {
    // const formDetails = [sessionStorage.getItem('email'), form];
    const groupDetails = {
      groupName,
      email,
      form,
    };
    console.log(form.length);

    axios.post(`${backendServer}/creategroup`, groupDetails).then((response) => {
      console.log(response);
      cookie.save('groupSelected', groupName, {
        path: '/',
        httpOnly: false,
        maxAge: 90000,
      }); // sessionStorage.setItem('groupSelected', groupName);
      history.push('/groupHomePage');
    });
  };
  return (
    <div>
      <NavBarAfterLogin />
      <Row>
        <Col xs={2}>
          <LeftSideNavBar />
        </Col>
        <Col>
          <div className="container ">
            <h5>Start a new group:</h5>
            <h6>My group shall be called:</h6>
            <input
              type="text"
              className="groupName"
              name="Group Name"
              placeholder="Group Name"
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
            />
            <h4>Group Members:</h4>
            <p>
              {name} ({email})
            </p>

            {JSON.stringify(form)}

            <form>
              {form.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="row mt-3" key={`item-${index}`}>
                  <div className="col">
                    <input
                      type="text"
                      className={item.errors.Email ? 'form-control  is-invalid' : 'form-control'}
                      name="Email"
                      placeholder="Email"
                      value={item.Email}
                      onChange={(e) => onChange(index, e)}
                    />

                    {item.errors.Email && (
                      <div className="invalid-feedback">{item.errors.Email}</div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={(e) => handleRemoveField(e, index)}
                  >
                    X
                  </button>
                </div>
              ))}

              <button className="btn btn-primary mt-2" type="button" onClick={handleAddLink}>
                Add a member
              </button>
              <button className="btn btn-primary mt-2" type="button" onClick={createGroup}>
                Create group
              </button>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CreateGroup;
