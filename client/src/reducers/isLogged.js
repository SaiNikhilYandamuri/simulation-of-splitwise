const loggedReducer = (state = { username: '', email: '', currency: '' }, action) => {
  switch (action.type) {
    case 'LOG_IN':
      // eslint-disable-next-line no-param-reassign
      state = { username: action.payload, email: action.email, currency: action.currency };
      return state;
    case 'SIGN_IN':
      // eslint-disable-next-line no-param-reassign
      state = { username: action.payload, email: action.email, currency: 'USD' };
      return state;
    case 'LOG_OUT':
      // eslint-disable-next-line no-param-reassign
      state = { username: '', email: '', currency: '' };
      console.log(state);
      return state;
    default:
      return state;
  }
};

export default loggedReducer;
