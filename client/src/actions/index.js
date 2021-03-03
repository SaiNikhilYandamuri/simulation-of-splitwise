const logged = (username) => ({ type: 'LOG_IN', payload: username });

const signed = (username) => ({ type: 'SIGN_IN', payload: username });
export { signed, logged as default };
