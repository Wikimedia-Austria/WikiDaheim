import { replace } from 'connected-react-router';
import { fromJS } from 'immutable';
import {
  PLACE_SELECT_ACTION_SUCCESS,
  MAP_LOADED,
  selectPlace
} from 'redux/actions/app';
import { PUBLIC_ROOT } from 'config';

let initialLocation = window.location.pathname;

export default store => next => action => {
  const { type } = action;
  const { dispatch, getState } = store;
  const state = getState();

  if(
    [
      PLACE_SELECT_ACTION_SUCCESS
    ].includes( type )
  ) {
    let url = `${PUBLIC_ROOT}`;

    // retain burgenland campaign
    if(window.location.pathname.includes('burgenland')) {
      url += 'burgenland/';
    }

    /* UPDATE WIKIDATA ID */
    if( state.app.get('placeSelected') ) {
      const placeData = state.app.get('placeMapData');
      const placeProperties = placeData.get('properties');
      if(placeProperties) {
        let wikidata = placeProperties.get('wikidata');

        if( wikidata && wikidata.startsWith('Q') ) {
          url += `${encodeURIComponent(wikidata)}`;
        }
      }
    }

    dispatch( replace( url ) );
  }

  if ( MAP_LOADED === type ) {
    const startPattern = `${PUBLIC_ROOT}Q`;
    if( initialLocation.startsWith( startPattern ) ) {
      const props = initialLocation.substr( startPattern.length).split('/');
      const wikidata = `Q${props[props.length-1]}`;

      // check if this was a window reload
      const placeData = state.app.get('placeMapData');
      if( placeData && placeData.get('properties') && placeData.get('properties').get('wikidata') === wikidata ) return;

      setTimeout(() => dispatch(selectPlace(fromJS( { properties: { wikidata } } ))), 100);
    }
  }

  return next(action);
}
