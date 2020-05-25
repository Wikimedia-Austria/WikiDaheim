export const TOGGLE_MENU = 'TOGGLE_MENU';
export const TOGGLE_FILTER_MENU = 'TOGGLE_FILTER_MENU';
export const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS';

// Test action

export function toggleMenu() {
  return {
    type: TOGGLE_MENU,
  };
}

export function toggleFilterMenu() {
  return {
    type: TOGGLE_FILTER_MENU,
  };
}

export function toggleSettings() {
  return {
    type: TOGGLE_SETTINGS,
  };
}
