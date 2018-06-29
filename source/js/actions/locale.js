export const SET_LOCALE = 'SET_LOCALE';

// Test action

export function setLanguage(data) {
  return {
    type: SET_LOCALE,
    data,
  };
}
