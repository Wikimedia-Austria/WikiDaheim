import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './workers/serviceWorker';
import * as Sentry from '@sentry/browser';
import { SENTRY_DSN } from './config';

// add sentry error tracking
Sentry.init({dsn: SENTRY_DSN});

//initialize React-App
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
