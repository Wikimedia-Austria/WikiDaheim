import { Map, List, fromJS } from "immutable";
import uuidv4 from "/src/utils/uuidv4";
import { isPointWithinRadius } from "geolib";
import confirm from "/src/utils/confirm";

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
  PLACE_SELECT_CLEAR,
  PLACE_TOGGLE_CATEGORY,
  PLACE_LOAD_CATEGORY_ACTION_START,
  PLACE_LOAD_CATEGORY_ACTION_ERROR,
  PLACE_LOAD_CATEGORY_ACTION_SUCCESS,
  PLACE_ITEM_HOVER,
  PLACE_ITEM_LEAVE,
  PLACE_ITEM_SELECT,
  MUNICIPALITY_HOVER,
  MUNICIPALITY_LEAVE,
  MAP_POSITION_CHANGED,
  MAP_ZOOM_CHANGED,
  MAP_LOADED,
  TOGGLE_FILTER,
  SET_SEARCH_FILTER,
  TOGGLE_SYNC_LIST_MAP,
  TOGGLE_CLUSTERING,
  MOBILE_VIEW_SWITCH,
  TOGGLE_CITY_INFO,
} from "../actions/app";

const initialState = Map({
  searchLoading: false,
  searchError: null,
  searchData: new List(),
  searchText: "",

  categoriesLoading: true,
  categoriesError: false,
  categories: new List(),

  activeFilters: new List(),
  searchFilter: "",

  placeSelected: false,
  placeLoading: false,
  placeError: null,
  placeMapData: new Map(),
  articles: new List(),
  items: new List(),
  commonscat: "",
  gpxlink: "",

  hoveredElement: null,
  hoveredMunicipality: null,
  selectedElement: null,
  currentMapPosition: fromJS([13.2, 47.516231]),
  currentMapZoom: 7,
  mapLoaded: true,

  mobileView: "map",
  syncListAndMap: true,
  showCityInfo: false,
  enableClustering: true,
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
      searchData: fromJS(action.data),
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
    const categories = action.data.map((category) =>
      Object.assign({}, category, {
        show: true,
        loaded: false,
        loading: false,
      })
    );

    return state.merge({
      categoriesLoading: false,
      categories: fromJS(categories),
    });
  },

  [PLACE_SELECT_ACTION_START]: (state, action) => {
    return state.merge({
      searchLoading: false,
      searchData: new List(),
      searchText: action.data.get("text") || "...",
      placeMapData: action.data,
      placeLoading: true,
      placeError: null,
      items: new List(),
      searchFilter: "", // reset search filter?
    });
  },
  [PLACE_SELECT_ACTION_ERROR]: (state, action) => {
    confirm({
      title: "Fehler beim Laden des Ortes / Error loading municipality",
      content: action.error,
      confirmTitle: "OK",
    });

    return state.merge({
      placeLoading: false,
      placeError: action.data,
      searchText: "",
      searchLoading: false,
    });
  },
  [PLACE_SELECT_ACTION_SUCCESS]: (state, action) => {
    // update which categories are already loaded
    const categories = state.get("categories").map((category) => {
      const loaded = action.data.selectedCats.includes(category.get("name"));
      return category.set("loaded", loaded);
    });

    // add UIDs to the items as the API doesn't
    const items = action.data.categories.map((item) =>
      Object.assign({}, item, {
        id: uuidv4(),
        categories: [item.category],
      })
    );

    // merge Image Requests with other categories if they are a duplicate
    let imageRequests = items.filter((item) => item.category === "request");
    const nonImageRequests = items.filter(
      (item) => !["request", "commons"].includes(item.category)
    );

    // loop through all non-image-requests and check if there is an image request nearby
    // if so, add the information to the current item and discard to image request item
    const mappedNonImageRequests = nonImageRequests.map((item, index, arr) => {
      const nearestElements = imageRequests.filter((r) =>
        isPointWithinRadius(r, item, 15)
      );

      nearestElements.forEach((nearestElement) => {
        // rm request from request array
        imageRequests.splice(
          imageRequests.findIndex((i) => i.id === nearestElement.id),
          1
        );

        // add the source
        const source = Array.isArray(item.source) ? item.source : [item.source];
        const addedSource = nearestElement.source || {
          title: nearestElement.name,
          link: nearestElement.editLink,
        };

        //check if the source already exists
        if (source.filter((i) => i.link === addedSource.link).length === 0)
          source.push(addedSource);

        // populate item with information from the request
        item = Object.assign({}, item, {
          categories: item.categories.concat(
            nearestElement.categories.filter(
              (cat) => item.categories.indexOf(cat) < 0
            )
          ),
          source,
        });
      });

      return item;
    });

    const processedItems = mappedNonImageRequests.concat(
      imageRequests,
      items.filter((item) => item.category === "commons")
    );

    // merge by wikiData ID
    const mergedItems = processedItems.reduce((acc, item) => {
      // check if wd-item prop exists
      if (!item["wd-item"]) {
        return acc.concat(item);
      }

      // check if item already exists in acc
      const existingItem = acc.find((i) => i["wd-item"] === item["wd-item"]);

      // if it exists, merge the categories
      if (existingItem) {
        existingItem.categories = existingItem.categories.concat(
          item.categories.filter(
            (cat) => existingItem.categories.indexOf(cat) < 0
          )
        );

        const source = Array.isArray(existingItem.source)
          ? existingItem.source
          : [existingItem.source];
        const addedSource = Array.isArray(item.source)
          ? item.source
          : [item.source];

        existingItem.source = source.concat(addedSource);
        console.log("Merged Items by wikidata ID", existingItem, item);
        return acc;
      }

      return acc.concat(item);
    }, []);

    return state.merge({
      placeSelected: true,
      placeLoading: false,
      searchText: action.data.name,
      placeMapData: fromJS({
        ...state.get("placeMapData").toJS(),
        text: action.data.name,
        iso: action.data.gemeindekennzahl,
        properties: {
          wikidata: action.data.wikidata,
        },
        geometry: {
          coordinates: [
            action.data.location.longitude,
            action.data.location.latitude,
          ],
        },
      }),
      categories,
      items: fromJS(mergedItems),
      articles: fromJS(action.data.articles),
      commonscat: action.data.commonscat,
      gpxlink: action.data.GPX,
    });
  },

  [PLACE_SELECT_CLEAR]: (state, action) => {
    return state.merge({
      placeSelected: false,
      placeLoading: false,
      placeError: null,
      placeMapData: new Map(),
      articles: new List(),
      items: new List(),
      commonscat: "",
      gpxlink: "",
      searchText: "",
      searchLoading: false,
    });
  },

  [PLACE_TOGGLE_CATEGORY]: (state, action) => {
    const curr = state.get("categories");

    // check if all categories are selected
    const allSelected = !curr.find((c) => !c.get("show"));

    // if it would "untoggle" this only category untoggle all other categories
    let categories = curr.map((category) => {
      if (allSelected)
        return category.merge({
          show: !!(category.get("name") === action.data),
        });
      else if (category.get("name") === action.data)
        return category.merge({ show: !category.get("show") });
      return category;
    });

    // now check if we cleared all selections
    const noneSelected = !categories.find((c) => c.get("show"));
    if (noneSelected) {
      categories = curr.map((category) => category.merge({ show: true }));
    }

    return state.merge({
      categories,
    });
  },

  [TOGGLE_FILTER]: (state, action) => {
    const current = state.get("activeFilters");
    const toggle = action.data;
    const activeFilters = current.includes(toggle)
      ? current.filterNot((x) => x === toggle)
      : current.push(toggle);

    return state.merge({
      activeFilters,
    });
  },

  [SET_SEARCH_FILTER]: (state, action) => {
    return state.merge({
      searchFilter: action.data,
    });
  },

  [PLACE_LOAD_CATEGORY_ACTION_START]: (state, action) => {
    console.error("DEPRECATED API IN USE");
    const curr = state.get("categories");
    const categories = curr.update(
      curr.findIndex((cat) => cat.get("name") === action.data),
      (old) => {
        return old.merge({ loading: true });
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
    console.error("DEPRECATED API IN USE");
    const loadedCategory = action.data.selectedCats[0];

    const curr = state.get("categories");
    const categories = curr.update(
      curr.findIndex((cat) => cat.get("name") === loadedCategory),
      (old) => {
        return old.merge({
          loaded: true,
          loading: false,
        });
      }
    );

    // add UIDs to the items as the API doesn't, also prepare for category merging
    const newItems = action.data.categories.map((item) =>
      Object.assign({}, item, {
        id: uuidv4(),
        categories: [item.category],
      })
    );
    const items = state.get("items").merge(newItems);

    return state.merge({
      categories,
      items,
    });
  },

  // MAP ITEMS HOVER
  [PLACE_ITEM_HOVER]: (state, action) => {
    return state.merge({
      hoveredElement: action.data,
    });
  },

  [PLACE_ITEM_LEAVE]: (state) => {
    return state.merge({
      hoveredElement: null,
    });
  },

  // MAP ITEM SELECT
  [PLACE_ITEM_SELECT]: (state, action) => {
    const selectedElement = action.data.merge({
      source: action.source,
      lastChange: Date.now(),
    });

    return state.merge({
      selectedElement,
      mobileView: "list",
    });
  },

  // MAP MUNICIPALITIES HOVER
  [MUNICIPALITY_HOVER]: (state, action) => {
    return state.merge({
      hoveredMunicipality: new Map(action.data),
    });
  },

  [MUNICIPALITY_LEAVE]: (state) => {
    return state.merge({
      hoveredMunicipality: null,
    });
  },

  // MAP POSITION change
  [MAP_POSITION_CHANGED]: (state, action) => {
    return state.merge({
      currentMapPosition: fromJS(action.data),
    });
  },

  // MAP ZOOM change
  [MAP_ZOOM_CHANGED]: (state, action) => {
    return state.merge({
      currentMapZoom: action.data,
    });
  },

  // MAP LOADED
  [MAP_LOADED]: (state, action) => {
    return state.merge({
      mapLoaded: true,
    });
  },

  // MOBILE VIEW SWITCH
  [MOBILE_VIEW_SWITCH]: (state, action) => {
    return state.merge({
      mobileView: action.data,
    });
  },

  [TOGGLE_SYNC_LIST_MAP]: (state) => {
    const syncListAndMap = !state.get("syncListAndMap");

    return state.merge({
      syncListAndMap,
    });
  },

  [TOGGLE_CLUSTERING]: (state) => {
    const enableClustering = !state.get("enableClustering");

    return state.merge({
      enableClustering,
    });
  },

  [TOGGLE_CITY_INFO]: (state) => {
    const showCityInfo = !state.get("showCityInfo");

    return state.merge({
      showCityInfo,
    });
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
