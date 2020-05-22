import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import locale from './locale';
import menu from './menu';
import app from './app';

export default (history) => combineReducers({
  router: connectRouter(history),
  locale,
  menu,
  app,
});
