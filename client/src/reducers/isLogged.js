const loggedReducer = (state = { username: '' }, action) => {
  switch (action.type) {
    case 'LOG_IN':
      // eslint-disable-next-line no-param-reassign
      state = { username: action.payload };
      return state;
    case 'SIGN_IN':
      // eslint-disable-next-line no-param-reassign
      state = { username: action.payload };
      return state;
    case 'LOG_OUT':
      return state;
    default:
      console.log('here');
      return state;
  }
};

export default loggedReducer;
