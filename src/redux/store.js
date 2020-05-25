import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { loadState, saveState } from 'redux/localStorage';
import historySyncMiddleware from 'redux/middleware/historySync';

import createRootReducer from './reducers';

export const persistedState = loadState();
export const history = createBrowserHistory();

// Creating store
export default () => {

  const store = createStore(
    createRootReducer(history),
    persistedState,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
        historySyncMiddleware
      )
    )
  );

  // save state to local storage
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};
