import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line import/no-named-as-default
import reportWebVitals from './reportWebVitals';

import allReducers from './reducers';
import './index.css';
import App from './App';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, allReducers);

/* eslint-disable no-underscore-dangle */
const store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__());
const persistor = persistStore(store);
/* eslint-enable */

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
