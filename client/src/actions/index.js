const logged = (username, emailaddress) => ({
  type: 'LOG_IN',
  payload: username,
  email: emailaddress,
});

const signed = (username, emailaddress) => ({
  type: 'SIGN_IN',
  payload: username,
  email: emailaddress,
});

const logout = (username, emailaddress) => ({
  type: 'LOG_OUT',
  payload: username,
  email: emailaddress,
});
export { signed, logout, logged as default };
