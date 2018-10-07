import { isLocationAction } from 'redux-first-router';
import { combineReducers } from 'redux-vertical';
import { addNS } from 'redux-vertical';

import matchesReducer from '../../Matches/redux';
import { ns as matchesNS, routesMap as matchesRoutes } from '../../Matches/redux';

export const ns = 'mainRouter';
export const mainRouterSelector = state => state[ns];

export const mainRouterReducer = addNS(ns, (state = 'NotFound', action) => {
  const { type } = action;
  if (!isLocationAction(action)) {
    return state;
  }
  if (matchesRoutes[type]) {
    return matchesNS;
  }
  return '';
});

export default combineReducers(
  matchesReducer,  
  mainRouterReducer
);
