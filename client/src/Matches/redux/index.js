import {
  composeReducers,
  createAction,
  createTypes,
  handleActions  } from 'redux-vertical';
import { isLocationAction } from 'redux-first-router';

import fetchMatchesEpic from './fetch-matches-epic';

export const epics = [
  fetchMatchesEpic
];

export const ns = 'matches';
export const types = createTypes([ 'onRouteMatches' ], ns);

export const routesMap = {
  [types.onRouteMatches]: '/',
};

export const onRouteMatches = createAction(types.onRouteMatches);

const defaultState = {
  validating: false
};

export default composeReducers(
  ns,
  function matchesRouteReducer(state = defaultState, action) {
    if (isLocationAction(action)) {
      const { type } = action;
      if (type === types.onRouteMatches) {
        console.log('action', action)
        console.log('matchesroutereducer')
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
