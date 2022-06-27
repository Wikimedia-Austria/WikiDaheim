import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { loadState, saveState } from 'redux/localStorage';
import historySync from './middleware/historySync';

import createRootReducer from './reducers';

export const persistedState = loadState();

// Creating store
const store = () => {

  const store = createStore(
    createRootReducer(),
    persistedState,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        historySync
      )
    )
  );

  // save state to local storage
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

export default store;
