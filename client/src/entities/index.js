import { property, merge } from 'lodash';
import {
  composeReducers,
  createAction,
  createTypes,
  handleActions
} from 'redux-vertical';

export const ns = 'entities';
export const getNS = state => state[ns];
export const entitiesSelector = getNS;
export const types = createTypes([
  'updateUserEmail'
], ns);

// updateUserEmail(username: String, email: String) => Action
export const updateUserEmail = createAction(
  types.updateUserEmail,
  (username, email) => ({ username, email })
);

// entity meta creators
const getEntityAction = property('meta.entitiesAction');

const defaultState = {
  user: {}
};

export default composeReducers(
  ns,
  function metaReducer(state = defaultState, action) {
    const { meta } = action;
    if (meta && meta.entities) {
      if (meta.entities.user) {
        return {
          ...state,
          user: {
            ...state.user,
            ...meta.entities.user
          }
        };
      }
      return merge({}, state, action.meta.entities);
    }
    return state;
  },
  function entitiesReducer(state = defaultState, action) {
    if (getEntityAction(action)) {
      const { payload: { username, theme } } = getEntityAction(action);
      return {
        ...state,
        user: {
          ...state.user,
          [username]: {
            ...state.user[username],
            theme
          }
        }
      };
    }
    return state;
  },
  handleActions(
    () => ({
      [types.updateUserEmail]: (state, { payload: { username, email } }) => ({
        ...state,
        user: {
          ...state.user,
          [username]: {
            ...state.user[username],
            email
          }
        }
      }),
    }),
    defaultState
  )
);
