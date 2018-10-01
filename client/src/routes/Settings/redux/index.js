import { isLocationAction } from 'redux-first-router';
import {
  composeReducers,
  createAction,
  createAsyncTypes,
  createTypes,
  handleActions
} from 'redux-vertical';
import { identity } from 'lodash';

import userUpdateEpic from './update-user-epic';
import ns from '../ns.json';

export const epics = [
  userUpdateEpic
];

export const types = createTypes([
  createAsyncTypes('updateMyEmail'),
  'updateNewUsernameValidity',
  createAsyncTypes('validateUsername'),
  'onRouteSettings',
  'onRouteUpdateEmail'
], ns);

export const onRouteSettings = createAction(types.onRouteSettings);
export const onRouteUpdateEmail = createAction(types.onRouteUpdateEmail);

export const updateMyEmail = createAction(types.updateMyEmail.start);
export const updateMyEmailComplete = createAction(
  types.updateMyEmail.complete
);
export const updateMyEmailError = createAction(
  types.updateMyEmail.error
);

export const updateNewUsernameValidity = createAction(
  types.updateNewUsernameValidity
);

export const validateUsername = createAction(types.validateUsername.start);
export const validateUsernameError = createAction(
  types.validateUsername.error,
  identity
);

const defaultState = {
  showUpdateEmailView: false,
  isValidUsername: false,
  validating: false
};

const getNS = state => state[ns];

export function settingsSelector(state) {
  return getNS(state);
}

export const showUpdateEmailViewSelector =
  state => getNS(state).showUpdateEmailView;

export default composeReducers(
  ns,
  function settingsRouteReducer(state = defaultState, action) {
    if (isLocationAction(action)) {
      const { type } = action;
      if (type === types.onRouteUpdateEmail) {
        return {
          ...state,
          showUpdateEmailView: true
        };
      }
      if (state.showUpdateEmailView) {
        return {
          ...state,
          showUpdateEmailView: false
        };
      }
    }
    return state;
  },
  handleActions(() => ({
    [types.updateNewUsernameValidity]: (state, { payload }) => ({
      ...state,
      isValidUsername: payload,
      validating: false
    }),
    [types.validateUsername.start]: state => ({
      ...state,
      isValidUsername: false,
      validating: true
    }),
    [types.validateUsername.error]: state => ({ ...state, validating: false })
  }),
  defaultState
)
);
