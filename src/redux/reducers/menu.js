import { Map } from 'immutable';

import {
  TOGGLE_MENU,
  TOGGLE_FILTER_MENU,
} from '../actions/menu';

const initialState = Map({
  showMenu: false,
  showFilterMenu: false,
});

const actionsMap = {
  [TOGGLE_MENU]: (state) => {
    const showMenu = !state.get('showMenu');

    return state.merge({
      showMenu,
    });
  },
  [TOGGLE_FILTER_MENU]: (state) => {
    const showFilterMenu = !state.get('showFilterMenu');

    return state.merge({
      showFilterMenu,
    });
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
