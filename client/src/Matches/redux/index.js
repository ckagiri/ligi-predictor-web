import {
  composeReducers,
  createAction,
  createTypes,
  createAsyncTypes,
  handleActions  } from 'redux-vertical';
import { isLocationAction } from 'redux-first-router';

import loadMatchesEpic from './matches-epic';

export const epics = [
  loadMatchesEpic
];

export const ns = 'matches';
export const types = createTypes([ 
  'onRouteMatches',
  'loadRoute',
  createAsyncTypes('loadMatches')
], ns);

export const routesMap = {
  [types.onRouteMatches]: '/matches',
};

export const onRouteMatches = createAction(types.onRouteMatches);
export const loadRoute = createAction(types.loadRoute);
export const loadMatches = createAction(types.loadMatches.start);
export const loadMatchesComplete = createAction(types.loadMatches.complete);

const initialState = {
  entities: {},
  loaded: false,
  loading: false
};

export default composeReducers(
  ns,
  function matchesRouteReducer(state = initialState, action) {
    if (isLocationAction(action)) {
      const { type } = action;
      if (type === types.onRouteMatches) {
        return state
      }
    }
    return state;
  },
  handleActions(
    () => ({
      [types.loadMatches.complete]: (state, { payload: matches }) => {  
        const entities = matches.reduce(
          (entities, match) => {
            return {
              ...entities,
              [match.id]: match 
            }
          }, {
            ...state.entities
          });
        return {
          ...state,
          loading: false,
          loaded: true,
          entities,
        }
      }
    }),
    initialState
  )
);
