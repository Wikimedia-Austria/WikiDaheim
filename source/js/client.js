/* REACT */
import React from 'react';
import ReactDOM from 'react-dom';

/* DEV TOOLS */
import { AppContainer } from 'react-hot-loader';

/* REDUX */
import { Provider } from 'react-redux';
import configureStore from 'config/store';

/* APP COMPONENTS */
import Client from 'components/Client';

/* POLYFILLS */
import es6Promise from 'es6-promise';
import 'isomorphic-fetch';

/* INTERNATIONALIZATION */
import { addLocaleData, IntlProvider } from 'react-intl';
import localeDE from 'react-intl/locale-data/de';
import { FALLBACK_LANGUAGE } from 'config/config';
import * as Messages from './languages';

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
        messages={ Messages.de }
        locale='de'
        defaultLocale={ FALLBACK_LANGUAGE }
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
  module.hot.accept('./components/Client', () => {
    const NewClient = require('./components/Client').default; // eslint-disable-line global-require

    render(NewClient);
  });
}
