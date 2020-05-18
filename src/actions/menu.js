export const TOGGLE_MENU = 'TOGGLE_MENU';
export const TOGGLE_FILTER_MENU = 'TOGGLE_FILTER_MENU';

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
