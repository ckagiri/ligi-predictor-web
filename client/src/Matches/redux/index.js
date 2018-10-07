import {
  composeReducers,
  createAction,
  createTypes,
  handleActions  } from 'redux-vertical';
import { isLocationAction } from 'redux-first-router';

import loadMatchesEpic from './load-matches-epic';

export const epics = [
  loadMatchesEpic
];

export const ns = 'matches';
export const types = createTypes([ 
  'onRouteMatches',
  'loadMatches',
], ns);

export const routesMap = {
  [types.onRouteMatches]: '/matches',
};

export const onRouteMatches = createAction(types.onRouteMatches);
export const loadMatches = createAction(types.loadMatches);

const defaultState = {
  validating: false
};

export default composeReducers(
  ns,
  function matchesRouteReducer(state = defaultState, action) {
    if (isLocationAction(action)) {
      const { type } = action;
      if (type === types.onRouteMatches) {
        return state
      }
    }
    return state;
  },
  handleActions(() => ({
    [types.changePrediction]: (state, { payload }) => ({
      ...state,
      validating: false
    })
  }),
    defaultState
  )
);
