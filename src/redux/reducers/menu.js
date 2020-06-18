import { Map } from 'immutable';

import {
  TOGGLE_MENU,
  TOGGLE_FILTER_MENU,
  TOGGLE_SETTINGS
} from '../actions/menu';

const initialState = Map({
  showMenu: false,
  showFilterMenu: false,
  showSettings: false,
});

const actionsMap = {
  [TOGGLE_MENU]: (state) => {
    const showMenu = !state.get('showMenu');

    return state.merge({
      showMenu,
      showSettings: false,
      showFilterMenu: false
    });
  },
  [TOGGLE_FILTER_MENU]: (state) => {
    const showFilterMenu = !state.get('showFilterMenu');

    return state.merge({
      showFilterMenu,
      showSettings: false,
      showMenu: false,
    });
  },

  [TOGGLE_SETTINGS]: (state) => {
    const showSettings = !state.get('showSettings');

    return state.merge({
      showSettings,
      showMenu: false,
      showFilterMenu: false,
    });
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
