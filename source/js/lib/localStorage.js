import { fromJS } from 'immutable';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');

    if (serializedState == null) {
      return undefined;
    }

    const parsedState = JSON.parse(serializedState);

    return Object.keys(parsedState).reduce((previous, current) => {
      previous[current] = fromJS(parsedState[current]); //eslint-disable-line
      return previous;
    }, {});
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(
        Object.keys(state).reduce((previous, current) => {
        previous[current] = state[current].toJSON(); //eslint-disable-line
          return previous;
        }, {})
    );


    localStorage.setItem('state', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};
