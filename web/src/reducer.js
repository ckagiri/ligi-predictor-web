import { combineReducers } from 'redux-vertical';

import app from './redux';
import routes from './routes/redux';

export default combineReducers(
  app,
  routes
);
