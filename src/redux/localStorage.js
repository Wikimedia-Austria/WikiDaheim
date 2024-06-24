import { fromJS } from "immutable";

let stateSaveTimeout = false;

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");

    if (serializedState == null) {
      return undefined;
    }

    const parsedState = JSON.parse(serializedState);

    // RESET MAP LOADED
    parsedState.app.mapLoaded = false;

    // If Place Loading is still active, do not load the state - reset app instead
    if (parsedState.app.placeLoading) {
      return undefined;
    }

    return Object.keys(parsedState).reduce((previous, current) => {
      previous[current] = fromJS(parsedState[current]); //eslint-disable-line
      return previous;
    }, {});
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  // Cancel Timeout
  if (stateSaveTimeout) {
    clearTimeout(stateSaveTimeout);
  }

  // Use 2-Second Timeout to not always immediatelly save to local storage if there are a lot of actions triggered.
  stateSaveTimeout = setTimeout(
    (state) => {
      try {
        const serializedState = JSON.stringify(
          Object.keys(state).reduce((previous, current) => {
            if (current !== "router") {
              previous[current] = state[current].toJSON();
            }

            return previous;
          }, {})
        );

        localStorage.setItem("state", serializedState);
      } catch (err) {
        // Ignore write errors
      }
    },
    1000,
    state
  );
};

export const clearState = () => {
  try {
    localStorage.removeItem("state");
  } catch (err) {
    // Ignore write errors
  }
};
