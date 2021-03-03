const logged = () => ({ type: 'LOG_IN' });

const signed = () => ({ type: 'SIGN_IN' });
export { signed, logged as default };
