/* REACT */
import React from 'react';

/* REDUX */
import { Provider } from 'react-redux';
import configureStore from './config/store';

/* APP COMPONENTS */
import ReduxIntlProvider from './components/Global/ReduxIntlProvider';
import Client from './components/Client';

/* POLYFILLS */
import es6Promise from 'es6-promise';
import 'isomorphic-fetch';

// Load SCSS
import './scss/app.scss';

// Run Polyfills
es6Promise.polyfill();

// Init Redux-Store
const store = configureStore();

function App() {
  return (
    <Provider store={ store }>
      <ReduxIntlProvider>
        <Client />
      </ReduxIntlProvider>
    </Provider>
  );
}

export default App;
