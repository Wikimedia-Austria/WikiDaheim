import { Map, List } from 'immutable';

import {
  AUTOCOMPLETE_ACTION_START,
  AUTOCOMPLETE_ACTION_ERROR,
  AUTOCOMPLETE_ACTION_SUCCESS,

  LOAD_CATEGORIES_ACTION_START,
  LOAD_CATEGORIES_ACTION_ERROR,
  LOAD_CATEGORIES_ACTION_SUCCESS,

  PLACE_SELECT_ACTION_START,
  PLACE_SELECT_ACTION_ERROR,
  PLACE_SELECT_ACTION_SUCCESS,

  PLACE_TOGGLE_CATEGORY,
  PLACE_LOAD_CATEGORY_ACTION_START,
  PLACE_LOAD_CATEGORY_ACTION_ERROR,
  PLACE_LOAD_CATEGORY_ACTION_SUCCESS,
} from 'actions/app';

const initialState = Map({
  searchLoading: false,
  searchError: null,
  searchData: new List(),
  searchText: '',

  categoriesLoading: true,
  categoriesError: false,
  categories: new List(),

  placeSelected: false,
  placeLoading: false,
  placeError: null,
  placeMapData: new Map(),
  articles: new List(),
  items: new List(),
});

const actionsMap = {
  [AUTOCOMPLETE_ACTION_START]: (state, action) => {
    return state.merge({
      searchLoading: true,
      searchError: null,
      searchText: action.data,
    });
  },
  [AUTOCOMPLETE_ACTION_ERROR]: (state, action) => {
    return state.merge({
      searchLoading: false,
      searchError: action.data,
    });
  },
  [AUTOCOMPLETE_ACTION_SUCCESS]: (state, action) => {
    return state.merge({
      searchLoading: false,
      searchData: action.data,
    });
  },

  [LOAD_CATEGORIES_ACTION_START]: (state) => {
    return state.merge({
      categoriesLoading: true,
      categoriesError: null,
    });
  },
  [LOAD_CATEGORIES_ACTION_ERROR]: (state, action) => {
    return state.merge({
      categoriesLoading: false,
      categoriesError: action.data,
    });
  },
  [LOAD_CATEGORIES_ACTION_SUCCESS]: (state, action) => {
    const categories = action.data.map(
      (category) => Object.assign({}, category, {
        show: true,
        loaded: false,
        loading: false,
      })
    );

    return state.merge({
      categoriesLoading: false,
      categories,
    });
  },

  [PLACE_SELECT_ACTION_START]: (state, action) => {
    const region = action.data.get('context').find((context) => {
      const id = context.get('id').split('.');
      if (id[0] === 'region') return true;
      return false;
    });

    return state.merge({
      searchLoading: false,
      searchData: new List(),
      searchText: `${ action.data.get('text') }, ${ region.get('text') }`,
      placeMapData: action.data,
      placeLoading: true,
      placeError: null,
    });
  },
  [PLACE_SELECT_ACTION_ERROR]: (state, action) => {
    return state.merge({
      placeLoading: false,
      placeError: action.data,
    });
  },
  [PLACE_SELECT_ACTION_SUCCESS]: (state, action) => {
    // update which categories are already loaded
    const categories = state.get('categories').map((category) => {
      const loaded = action.data.selectedCats.includes(category.get('name'));
      return category.set('loaded', loaded);
    });

    return state.merge({
      placeSelected: true,
      placeLoading: false,
      categories,
      articles: action.data.articles,
      items: action.data.categories,
    });
  },

  [PLACE_TOGGLE_CATEGORY]: (state, action) => {
    const curr = state.get('categories');

    // check if all categories are selected
    const allSelected = !curr.find((c) => !c.get('show'));

    // if it would "untoggle" this only category untoggle all other categories
    let categories = curr.map((category) => {
      if (allSelected) return category.merge({ 'show': !!(category.get('name') === action.data) });
      else if (category.get('name') === action.data) return category.merge({ 'show': !category.get('show') });
      return category;
    });

    // now check if we cleared all selections
    const noneSelected = !categories.find((c) => c.get('show'));
    if (noneSelected) {
      categories = curr.map((category) => category.merge({ 'show': true }));
    }

    return state.merge({
      categories,
    });
  },
  [PLACE_LOAD_CATEGORY_ACTION_START]: (state, action) => {
    const curr = state.get('categories');
    const categories = curr.update(
      curr.findIndex((cat) => cat.get('name') === action.data), (old) => {
        return old.merge({ 'loading': true });
      }
    );

    return state.merge({
      categories,
      placeError: null,
    });
  },
  [PLACE_LOAD_CATEGORY_ACTION_ERROR]: (state, action) => {
    return state.merge({
      placeError: action.data,
    });
  },
  [PLACE_LOAD_CATEGORY_ACTION_SUCCESS]: (state, action) => {
    const loadedCategory = action.data.selectedCats[0];

    const curr = state.get('categories');
    const categories = curr.update(
      curr.findIndex((cat) => cat.get('name') === loadedCategory), (old) => {
        return old.merge({
          loaded: true,
          loading: false,
        });
      }
    );

    const items = state.get('items').merge(action.data.categories);

    return state.merge({
      categories,
      items,
    });
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
