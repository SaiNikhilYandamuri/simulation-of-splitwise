/* eslint-disable no-param-reassign */
import alert from 'alert';

const loggedReducer = (state = { username: '', email: '' }, action) => {
  switch (action.type) {
    case 'LOG_IN':
      // eslint-disable-next-line no-param-reassign
      state = { username: action.payload, email: action.email };
      return state;
    case 'SIGN_IN':
      // eslint-disable-next-line no-param-reassign
      state = { username: action.payload, email: action.email };
      return state;
    case 'LOG_OUT':
      // eslint-disable-next-line no-param-reassign
      state = undefined;
      alert('hello');
      console.log(state);
      return state;
    default:
      return state;
  }
};

export default loggedReducer;
