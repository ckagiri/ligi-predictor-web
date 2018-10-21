import { flow, identity } from 'lodash';
import { of } from 'rxjs';
import {
  combineActions,
  createAction,
  createAsyncTypes,
  createTypes,
  handleActions
} from 'redux-vertical';
import { createSelector } from 'reselect';

import loadUserEpic from './user-epic';

import { paramsSelector } from '../router/redux';
import hardGoToEpic from './location-epic';

const ns = 'app';

export const epics = [
  loadUserEpic,
  hardGoToEpic
];

export const types = createTypes([
  createAsyncTypes('loadUser'),
  'noUserFound',
  'showSignIn',
  'handleError',
  'hardGoTo',
  'setLoadingState'
], ns);

export const loadUser = createAction(types.loadUser.start);
export const loadUserComplete = createAction(types.loadUser.complete);
export const noUserFound = createAction(types.noUserFound);
export const setLoadingState = createAction(types.setLoadingState);

export const hardGoTo = createAction(types.hardGoTo);

export const createErrorObservable = error => of({
  type: types.handleError,
  error
});
// use sparingly
// doActionOnError(
//   actionCreator: (() => Action|Null)
// ) => (error: Error) => Observable[Action]
export const doActionOnError = actionCreator => error => of(
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

export default handleActions(
  () => ({
    [types.loadUser.complete]: (state, { payload: user }) => ({
      ...state,
      user
    }),
    [
      combineActions(types.showSignIn, types.loadUser.complete)
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
