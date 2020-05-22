import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { loadState, saveState } from 'lib/localStorage';

import rootReducer from '../redux/reducers';

const persistedState = loadState();

// Creating store
export default () => {

  const store = createStore(
    rootReducer,
    persistedState,
    composeWithDevTools(
      applyMiddleware(
        thunk
      )
    )
  );

  // save state to local storage
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};
