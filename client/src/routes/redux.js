import { isLocationAction } from 'redux-first-router';
import { combineReducers } from 'redux-vertical';

import settingsReducer from './Settings/redux';
import { routesMap as settingsRoutes } from './Settings';
import { routesMap as homeRoutes } from './Home';

const ns = 'mainRouter';

export const mainRouteSelector = state => state[ns];

export function mainRouter(state = 'NotFound', action) {
  if (!isLocationAction(action)) {
    return state;
  }
  const { type } = action;
  if (homeRoutes[type]) {
    return 'home';
  }
  if (settingsRoutes[type]) {
    return 'settings';
  }
  return '';
}

mainRouter.toString = () => ns;

export default combineReducers(
  settingsReducer,
  mainRouter
);
