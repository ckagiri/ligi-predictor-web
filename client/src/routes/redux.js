import { isLocationAction } from 'redux-first-router';
import { combineReducers } from 'redux-vertical';

import settingsReducer from './Settings/redux';
import { routes as settingsRoutes } from './Settings';

const ns = 'mainRouter';

export const mainRouteSelector = state => state[ns];

export function mainRouter(state = 'NotFound', action) {
  if (!isLocationAction(action)) {
    return state;
  }
  const { type } = action;
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
