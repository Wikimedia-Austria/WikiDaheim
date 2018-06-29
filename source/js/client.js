/* REACT */
import React from 'react';
import ReactDOM from 'react-dom';

/* DEV TOOLS */
import { AppContainer } from 'react-hot-loader';

/* REDUX */
import { Provider } from 'react-redux';
import configureStore from 'config/store';

/* APP COMPONENTS */
import ReduxIntlProvider from 'components/Global/ReduxIntlProvider';
import Client from 'components/Client';

/* POLYFILLS */
import es6Promise from 'es6-promise';
import 'isomorphic-fetch';
import ViewportUnits from 'viewport-units-buggyfill';

// Load SCSS
import '../scss/app.scss';

es6Promise.polyfill();
//ViewportUnits.init();

const store = configureStore();

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={ store }>
        <ReduxIntlProvider>
          <Component />
        </ReduxIntlProvider>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

// Render app
render(Client);

if (module.hot) {
  module.hot.accept('./components/Client', () => {
    const NewClient = require('./components/Client').default; // eslint-disable-line global-require

    render(NewClient);
  });
}
