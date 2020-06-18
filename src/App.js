/* REACT */
import React from 'react';

/* REDUX */
import { Provider } from 'react-redux';
import configureStore, { history } from 'redux/store';

/* ROUTER */
import { ConnectedRouter } from 'connected-react-router';

/* APP COMPONENTS */
import ReduxIntlProvider from 'components/Global/ReduxIntlProvider';
import Root from 'components/Root';
import ScrollToTop from 'components/Global/ScrollToTop';


// Load SCSS
import './scss/app.scss';

// Init Redux-Store
const store = configureStore();

function App() {
  return (
    <Provider store={ store }>
      <ReduxIntlProvider>
        <ConnectedRouter history={ history }>
          <ScrollToTop>
            <Root />
          </ScrollToTop>
        </ConnectedRouter>
      </ReduxIntlProvider>
    </Provider>
  );
}

export default App;
