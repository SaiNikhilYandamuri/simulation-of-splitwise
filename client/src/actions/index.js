const logged = (username, emailaddress, currency) => ({
  type: 'LOG_IN',
  payload: username,
  email: emailaddress,
  currency,
});

const signed = (username, emailaddress, currency) => ({
  type: 'SIGN_IN',
  payload: username,
  email: emailaddress,
  currency,
});

const logout = (username, emailaddress, currency) => ({
  type: 'LOG_OUT',
  payload: username,
  email: emailaddress,
  currency,
});
export { signed, logout, logged as default };
