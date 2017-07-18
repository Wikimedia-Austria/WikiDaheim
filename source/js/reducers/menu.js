import { Map } from 'immutable';

import { TOGGLE_MENU } from 'actions/menu';

const initialState = Map({
  showMenu: false,
});

const actionsMap = {
  [TOGGLE_MENU]: (state) => {
    const showMenu = !state.get('showMenu');

    return state.merge({
      showMenu,
    });
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
