import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'dev/logger';

import rootReducer from 'reducers';

const isProduction = process.env.NODE_ENV === 'production';

// Creating store
export default () => {
  let store = null;

  if (isProduction) {
    // In production adding only thunk middleware
    const middleware = applyMiddleware(thunk);

    store = createStore(
      rootReducer,
      middleware
    );
  } else {
    // In development mode beside thunk
    // logger and DevTools are added
    const middleware = applyMiddleware(thunk, logger);
    let enhancer;

    // Enable DevTools if browser extension is installed
    if (!process.env.SERVER_RENDER && window.__REDUX_DEVTOOLS_EXTENSION__) { // eslint-disable-line
      enhancer = compose(
        middleware,
        window.__REDUX_DEVTOOLS_EXTENSION__() // eslint-disable-line
      );
    } else {
      enhancer = compose(middleware);
    }

    store = createStore(
      rootReducer,
      enhancer
    );

    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers/index').default; // eslint-disable-line global-require
        store.replaceReducer(nextRootReducer);
      });
    }
  }

  return store;
};
