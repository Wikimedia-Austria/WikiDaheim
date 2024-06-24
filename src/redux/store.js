import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { loadState, saveState } from "/src/redux/localStorage";
import historySync from "./middleware/historySync";

import createRootReducer from "./reducers";

export const persistedState = loadState();

// Creating store
const store = () => {
  const store = createStore(
    createRootReducer(),
    persistedState,
    applyMiddleware(thunk, historySync)
  );

  // save state to local storage
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

export default store;
