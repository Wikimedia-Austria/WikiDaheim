import { combineReducers } from 'redux';
import locale from 'reducers/locale';
import menu from 'reducers/menu';
import app from 'reducers/app';

export default combineReducers({
  locale,
  menu,
  app,
});
