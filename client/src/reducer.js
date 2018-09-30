import { combineReducers } from 'redux-vertical';

import app from './redux';
import entities from './entities';
import nav from './Nav/redux';
import routes from './routes/redux';

export default combineReducers(
  app,
  entities,
  nav,
  routes
);
