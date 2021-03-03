import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line import/no-named-as-default
import reportWebVitals from './reportWebVitals';

import allReducers from './reducers';
import './index.css';
import App from './App';

/* eslint-disable no-underscore-dangle */
const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__());
/* eslint-enable */

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
