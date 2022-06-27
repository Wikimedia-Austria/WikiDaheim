import { combineReducers } from 'redux';
import locale from './locale';
import menu from './menu';
import app from './app';

const reducers = () => combineReducers({
  locale,
  menu,
  app,
});

export default reducers;
