import React, { useEffect, useState } from 'react';
import { Col, Row, Nav, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router';
// eslint-disable-next-line import/no-duplicates
// import TableCell from '@material-ui/core/TableCell';
// eslint-disable-next-line import/no-duplicates
// import TableHead from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
// eslint-disable-next-line import/no-duplicates
import TableCell from '@material-ui/core/TableCell';
// eslint-disable-next-line import/no-duplicates
// import TableSortLabel from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
// import cookie from 'react-cookies';
import Navbar from 'react-bootstrap/Navbar';
// import Button from 'react-bootstrap/Button';
import NavBarAfterLogin from '../NavBarAfterLogin';
import backendServer from '../../Config';
import LeftSideNavBar from '../LeftSideNavBar';

function RecentActivity() {
  const [text, getText] = useState([]);
  const [alert, setAlert] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  // const email = cookie.load('email');
  const userId = localStorage.getItem('user_id');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    // eslint-disable-next-line radix
    setRowsPerPage(parseInt(event.target.value, 10), 10);
    setPage(0);
  };
  useEffect(async () => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const getURL = `${backendServer}/recentActivity/${userId}`;
    const response = await axios.get(getURL);
    console.log(response.data);
    const array = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(response.data)) {
      console.log(key);
      console.log(value);
      array.push(value);
    }
    console.log(response.data);
    if (array.length === 0) {
      setAlert('No recent activity to show');
    }
    getText(array);
  }, []);
  let redirectVar = null;
  if (!localStorage.getItem('token')) {
    redirectVar = <Redirect to="/login" />;
  }
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
              <Navbar.Brand href="./recentActivity" data-testid="RecentActivity">
                Recent Activity
              </Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
            </Navbar>
            <Row>
              <Col>
                <TableContainer>
                  <Table>
                    {text
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item) => (
                        <TableRow>
                          <TableCell key={item}>{item}</TableCell>
                        </TableRow>
                      ))}
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[2, 5, 10]}
                  component="div"
                  count={text.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />

                {alert.length > 0 && <Alert variant="light">{alert}</Alert>}
              </Col>
            </Row>
          </Col>
          <Col />
        </Row>
      </div>
    </div>
  );
}

export default RecentActivity;
