import { Map } from 'immutable';

import {
  SET_LOCALE,
} from 'actions/locale';

const initialState = Map({
  language: 'de', // TODO: read default language from file
});

const actionsMap = {
  [SET_LOCALE]: (state, action) => {
    return state.merge({
      language: action.data,
    });
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
