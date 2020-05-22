import { combineReducers } from 'redux';
import locale from './locale';
import menu from './menu';
import app from './app';

export default combineReducers({
  locale,
  menu,
  app,
});
