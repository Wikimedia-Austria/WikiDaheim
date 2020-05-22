import { Map } from 'immutable';

import { SET_LOCALE } from 'redux/actions/locale';
import { FALLBACK_LANGUAGE } from 'config/config';

import languages from 'translations/languages.json';

const detectedLanguage = languages.filter(
  l => l.locale === navigator.language.substring(0, 2)
).map(l => l.locale);

const initialState = Map({
  language: detectedLanguage[0] || FALLBACK_LANGUAGE,
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
