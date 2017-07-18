import { combineReducers } from 'redux';
import menu from 'reducers/menu';
import app from 'reducers/app';

export default combineReducers({
  menu,
  app,
});
