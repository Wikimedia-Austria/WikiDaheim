import { replace } from 'connected-react-router';
import { fromJS } from 'immutable';
import {
  MAP_POSITION_CHANGED,
  PLACE_SELECT_ACTION_SUCCESS,
  MAP_LOADED,
  selectPlace
} from 'redux/actions/app';
import { PUBLIC_ROOT } from 'config';

let initialLocation = window.location.pathname;

export default store => next => action => {
  const { type, data } = action;
  const { dispatch, getState } = store;
  const state = getState();

  if(
    [
      MAP_POSITION_CHANGED,
      PLACE_SELECT_ACTION_SUCCESS
    ].includes( type )
  ) {
    let url = `${PUBLIC_ROOT}`;

    const location = state.app.get('currentMapPosition');
    let lat = location.get(0);
    let lng = location.get(1);

    if( MAP_POSITION_CHANGED === type ) {
      lat = data[0];
      lng = data[1];
    }

    url += `@${lat.toFixed(5)},${lng.toFixed(5)}`;

    if( state.app.get('placeSelected') ) {
      const placeData = state.app.get('placeMapData');
      const placeProperties = placeData.get('properties');
      let id = placeData.get('id');
      let iso = placeData.get('iso');
      let title = placeData.get('text');
      let wikidata = placeProperties.get('wikidata');

      url += `/${encodeURIComponent(wikidata || iso || id)}/${encodeURIComponent(title)}`;
    }

    dispatch( replace( url ) );
  }

  if ( MAP_LOADED === type ) {
    const startPattern = `${PUBLIC_ROOT}@`;
    if( initialLocation.startsWith( startPattern ) ) {
      const props = initialLocation.substr( startPattern.length).split('/');

      if( props.length >= 3 ) {
        const latlng = props[0].split(',').map(Number);
        const id = decodeURIComponent(props[1]);
        const text = decodeURIComponent(props[2]);
        const properties = id.startsWith('Q') ? { wikidata: id } : {};

        const data = {
          id,
          text,
          geometry: {
            coordinates: [
              latlng[0],
              latlng[1],
            ],
          },
          properties
        };

        if( !id.startsWith('Q') ) {
          data.iso = id;
        }

        // check if this was a window reload
        const placeData = state.app.get('placeMapData');
        if( placeData.get('text') === text ) return;

        setTimeout(() => dispatch(selectPlace(fromJS( data ))), 100);
      }
    }
  }

  return next(action);
}
