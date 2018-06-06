import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import configureStore from 'config/store';
import Client from 'views/Client';

import { addLocaleData, IntlProvider } from 'react-intl';
import localeDE from 'react-intl/locale-data/de';
import messagesDE from 'translations/de.json';

import es6Promise from 'es6-promise';
import 'isomorphic-fetch';

// Load SCSS
import '../scss/app.scss';

es6Promise.polyfill();
addLocaleData([localeDE]);

const store = configureStore();

console.log(IntlProvider); //eslint-disable-line

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <IntlProvider
        messages={ messagesDE }
        locale={ navigator.locale }
        defaultLocale='de'
      >
        <Provider store={ store }>
          <Component />
        </Provider>
      </IntlProvider>
    </AppContainer>,
    document.getElementById('root')
  );
};

// Render app
render(Client);

if (module.hot) {
  module.hot.accept('./views/Client/', () => {
    const NewClient = require('./views/Client/index').default; // eslint-disable-line global-require

    render(NewClient);
  });
}
