import { replace } from 'connected-react-router'
import { MAP_POSITION_CHANGED, PLACE_SELECT_ACTION_SUCCESS } from 'redux/actions/app';
import { PUBLIC_ROOT } from 'config';

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
      let id = placeData.get('id');
      let title = placeData.get('text');

      url += `/${id}/${title}`;
    }

    dispatch( replace( url ) );
  }

  return next(action);
}
