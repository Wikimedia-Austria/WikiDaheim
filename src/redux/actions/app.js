import wikiDaheimApi from "../../api/wikidaheim";

export const AUTOCOMPLETE_ACTION_START = "AUTOCOMPLETE_ACTION_START";
export const AUTOCOMPLETE_ACTION_ERROR = "AUTOCOMPLETE_ACTION_ERROR";
export const AUTOCOMPLETE_ACTION_SUCCESS = "AUTOCOMPLETE_ACTION_SUCCESS";

export const LOAD_CATEGORIES_ACTION_START = "LOAD_CATEGORIES_ACTION_START";
export const LOAD_CATEGORIES_ACTION_ERROR = "LOAD_CATEGORIES_ACTION_ERROR";
export const LOAD_CATEGORIES_ACTION_SUCCESS = "LOAD_CATEGORIES_ACTION_SUCCESS";

export const PLACE_SELECT_ACTION_START = "PLACE_SELECT_ACTION_START";
export const PLACE_SELECT_ACTION_ERROR = "PLACE_SELECT_ACTION_ERROR";
export const PLACE_SELECT_ACTION_SUCCESS = "PLACE_SELECT_ACTION_SUCCESS";

export const PLACE_SELECT_CLEAR = "PLACE_SELECT_CLEAR";

export const PLACE_TOGGLE_CATEGORY = "PLACE_TOGGLE_CATEGORY";
export const PLACE_LOAD_CATEGORY_ACTION_START =
  "PLACE_LOAD_CATEGORY_ACTION_START";
export const PLACE_LOAD_CATEGORY_ACTION_ERROR =
  "PLACE_LOAD_CATEGORY_ACTION_ERROR";
export const PLACE_LOAD_CATEGORY_ACTION_SUCCESS =
  "PLACE_LOAD_CATEGORY_ACTION_SUCCESS";

export const TOGGLE_FILTER = "TOGGLE_FILTER";

export const PLACE_ITEM_HOVER = "PLACE_ITEM_HOVER";
export const PLACE_ITEM_LEAVE = "PLACE_ITEM_LEAVE";
export const PLACE_ITEM_SELECT = "PLACE_ITEM_SELECT";

export const MUNICIPALITY_HOVER = "MUNICIPALITY_HOVER";
export const MUNICIPALITY_LEAVE = "MUNICIPALITY_LEAVE";

export const MAP_LOADED = "MAP_LOADED";
export const MAP_POSITION_CHANGED = "MAP_POSITION_CHANGED";
export const MAP_ZOOM_CHANGED = "MAP_ZOOM_CHANGED";

export const MOBILE_VIEW_SWITCH = "MOBILE_VIEW_SWITCH";

export const TOGGLE_SYNC_LIST_MAP = "TOGGLE_SYNC_LIST_MAP";
export const TOGGLE_CITY_INFO = "TOGGLE_CITY_INFO";
export const TOGGLE_CLUSTERING = "TOGGLE_CLUSTERING";

/*
  AUTOCOMPLETE ACTIONS
*/

function autocompleteActionStart(data) {
  return {
    type: AUTOCOMPLETE_ACTION_START,
    data,
  };
}

function autocompleteActionSuccess(data) {
  return {
    type: AUTOCOMPLETE_ACTION_SUCCESS,
    data,
  };
}

function autocompleteActionError(error) {
  return {
    type: AUTOCOMPLETE_ACTION_ERROR,
    error,
  };
}

let timeout = null;

export function autocomplete(query) {
  return function (dispatch, getState) {
    dispatch(autocompleteActionStart(query));

    if (timeout) {
      clearTimeout(timeout);
    }

    // timeout to prevent a call to the API with every keystroke
    timeout = setTimeout(() => {
      const lang = getState().locale.get("language");
      wikiDaheimApi
        .search(query, lang)
        .then((data) => dispatch(autocompleteActionSuccess(data)))
        .catch((error) => dispatch(autocompleteActionError(error)));
    }, 300);
  };
}

/*
  LOAD CATEGORIES ACTIONS
*/

function loadCategoriesActionStart(data) {
  return {
    type: LOAD_CATEGORIES_ACTION_START,
    data,
  };
}

function loadCategoriesActionSuccess(data) {
  return {
    type: LOAD_CATEGORIES_ACTION_SUCCESS,
    data,
  };
}

function loadCategoriesActionError(error) {
  return {
    type: LOAD_CATEGORIES_ACTION_ERROR,
    error,
  };
}

export function loadCategories() {
  return function (dispatch) {
    dispatch(loadCategoriesActionStart());

    wikiDaheimApi
      .listCategories()
      .then((data) => dispatch(loadCategoriesActionSuccess(data)))
      .catch((error) => dispatch(loadCategoriesActionError(error)));
  };
}

/*
  PLACE SELECT ACTIONS
*/

function placeSelectActionStart(data) {
  return {
    type: PLACE_SELECT_ACTION_START,
    data,
  };
}

function placeSelectActionSuccess(data) {
  return {
    type: PLACE_SELECT_ACTION_SUCCESS,
    data,
  };
}

function placeSelectActionError(error) {
  return {
    type: PLACE_SELECT_ACTION_ERROR,
    error,
  };
}

export function selectPlace(place) {
  return function (dispatch, getState) {
    dispatch(placeSelectActionStart(place));

    const coordinates = place.get("geometry")
      ? place.get("geometry").get("coordinates")
      : null;
    const wikidata =
      (place.get("properties") && place.get("properties").get("wikidata")) ||
      false;
    const iso = place.get("iso");
    const name = place.get("text") || "Loading...";

    const location = {
      name,
      iso,
      wikidata,
    };

    if (coordinates) {
      location.longitude = coordinates.get(0);
      location.latitude = coordinates.get(1);
    }

    // const selectedCats = getState().app.get('categories').filter((cat) => cat.get('show'));
    const selectedCats = getState().app.get("categories"); // always load all categories
    const mappedCats = selectedCats.toJS().map((cat) => cat.name);

    wikiDaheimApi
      .getTownData(location, mappedCats, true)
      .then((data) => dispatch(placeSelectActionSuccess(data)))
      .catch((error) => dispatch(placeSelectActionError(error)));
  };
}

/* CLEAR SELECTED PLACE */
export function placeSelectClear() {
  return {
    type: PLACE_SELECT_CLEAR,
  };
}

/* TOGGLE CATEGORY */

function placeToggleCategory(data) {
  return {
    type: PLACE_TOGGLE_CATEGORY,
    data,
  };
}

export function toggleCategory(categoryName) {
  return function (dispatch) {
    dispatch(placeToggleCategory(categoryName));
  };
}

/* TOGGLE FILTER */
export function toggleFilter(data) {
  return {
    type: TOGGLE_FILTER,
    data,
  };
}

/* PLACE ITEM HOVER */
export function placeItemHover(data) {
  return {
    type: PLACE_ITEM_HOVER,
    data,
  };
}

export function placeItemLeave(error) {
  return {
    type: PLACE_ITEM_LEAVE,
    error,
  };
}

/* PLACE ITEM SELECT */
export function placeItemSelect(data, source) {
  return {
    type: PLACE_ITEM_SELECT,
    data,
    source,
  };
}

/* MUNICIPALITY HOVER */
export function municipalityHover(data) {
  return {
    type: MUNICIPALITY_HOVER,
    data,
  };
}

export function municipalityLeave(error) {
  return {
    type: MUNICIPALITY_LEAVE,
    error,
  };
}

/* MAP MOVE */
let mapPositionTimeout = null;

export function mapPositionChanged(data) {
  return (dispatch) => {
    if (mapPositionTimeout) {
      clearTimeout(mapPositionTimeout);
    }

    // timeout to prevent multiple calls while touch zoom
    mapPositionTimeout = setTimeout(() => {
      dispatch({
        type: MAP_POSITION_CHANGED,
        data,
      });
    }, 100);
  };
}

/* MAP LOADED */
export function mapLoaded() {
  return {
    type: MAP_LOADED,
  };
}

/* MAP ZOOM */
export function mapZoomChanged(data) {
  return {
    type: MAP_ZOOM_CHANGED,
    data,
  };
}

/* Mobile View Switch */
export function mobileViewSwitch(data) {
  return {
    type: MOBILE_VIEW_SWITCH,
    data,
  };
}

/* List and Map Toggle */

export function toggleSyncListAndMap() {
  return {
    type: TOGGLE_SYNC_LIST_MAP,
  };
}

export function toggleClustering() {
  return {
    type: TOGGLE_CLUSTERING,
  };
}

/* Mobile City Info */

export function toggleCityInfo() {
  return {
    type: TOGGLE_CITY_INFO,
  };
}
