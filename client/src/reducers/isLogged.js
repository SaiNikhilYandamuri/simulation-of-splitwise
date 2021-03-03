const loggedReducer = (state = false, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return true;
    case 'SIGN_IN':
      return true;
    case 'LOG_OUT':
      return false;
    default:
      console.log('here');
      return state;
  }
};

export default loggedReducer;
