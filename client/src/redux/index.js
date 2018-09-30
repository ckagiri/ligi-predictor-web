import { flow, identity } from 'lodash';
import { Observable } from 'rx';
import {
  combineActions,
  createAction,
  createAsyncTypes,
  createTypes,
  handleActions
} from 'redux-vertical';
import { createSelector } from 'reselect';

import fetchUserEpic from './fetch-user-epic.js';

import { paramsSelector } from '../Router/redux';
import { types as map } from '../Map/redux';

import ns from '../ns.json';

export const epics = [
  fetchUserEpic
];

export const types = createTypes([
  'onRouteHome',

  'appMounted',

  createAsyncTypes('fetchUser'),
  'showSignIn',

  'handleError',
  'hardGoTo'
], ns);


export const onRouteHome = createAction(types.onRouteHome);
export const appMounted = createAction(types.appMounted);

export const fetchUser = createAction(types.fetchUser);
export const fetchUserComplete = createAction(
  types.fetchUser.complete,
  ({ result }) => result,
  identity
);

export const showSignIn = createAction(types.showSignIn);

// hardGoTo(path: String) => Action
export const hardGoTo = createAction(types.hardGoTo);

export const createErrorObservable = error => Observable.just({
  type: types.handleError,
  error
});
// use sparingly
// doActionOnError(
//   actionCreator: (() => Action|Null)
// ) => (error: Error) => Observable[Action]
export const doActionOnError = actionCreator => error => Observable.of(
  {
    type: types.handleError,
    error
  },
  actionCreator()
);


const defaultState = {
  title: 'Igil Predikta',
  isSignInAttempted: false,
  user: '',
  csrfToken: '',
  superBlocks: []
};

export const getNS = state => state[ns];
export const csrfSelector = state => getNS(state).csrfToken;
export const titleSelector = state => getNS(state).title;

export const signInLoadingSelector = state => !getNS(state).isSignInAttempted;

export const usernameSelector = state => getNS(state).user || '';
export const userSelector = createSelector(
  state => getNS(state).user,
  state => entitiesSelector(state).user,
  (username, userMap) => userMap[username] || {}
);

export const userByNameSelector = state => {
  const username = paramsSelector(state).username;
  const userMap = entitiesSelector(state).user;
  return userMap[username] || {};
};

export const isSignedInSelector = state => !!userSelector(state).username;

export default handleActions(
  () => ({
    [types.fetchUser.complete]: (state, { payload: user }) => ({
      ...state,
      user
    }),
    [
      combineActions(types.showSignIn, types.fetchUser.complete)
    ]: state => ({
      ...state,
      isSignInAttempted: true
    }),
    [types.delayedRedirect]: (state, { payload }) => ({
      ...state,
      delayedRedirect: payload
    })
  }),
  defaultState,
  ns
);
