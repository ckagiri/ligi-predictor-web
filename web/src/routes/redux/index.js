import { isLocationAction } from 'redux-first-router';
import { combineReducers } from 'redux-vertical';
import { addNS } from 'redux-vertical';

import { ns as homeNs, routesMap as homeRoutes } from '../../home/redux';
import matchesReducer from '../../matches/redux';
import { ns as matchesNs, routesMap as matchesRoutes } from '../../matches/redux';

export const ns = 'mainRouter';
export const mainRouterSelector = state => state[ns];

export const mainRouterReducer = addNS(ns, (state = 'NotFound', action) => {
  const { type } = action;
  if (!isLocationAction(action)) {
    return state;
  }
  if (homeRoutes[type]) {
    return homeNs;
  }
  if (matchesRoutes[type]) {
    return matchesNs;
  }
  return '';
});

export default combineReducers(
  matchesReducer,  
  mainRouterReducer
);
