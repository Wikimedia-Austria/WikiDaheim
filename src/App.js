/* REACT */
import React from 'react';

/* REDUX */
import { Provider } from 'react-redux';
import configureStore from './config/store';

/* APP COMPONENTS */
import ReduxIntlProvider from './components/Global/ReduxIntlProvider';
import Client from './components/Client';

// Load SCSS
import './scss/app.scss';

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
