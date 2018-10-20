
import { createTypes, createAction } from 'redux-vertical';
import onRouteHomeEpic from './home-epic';

export const epics = [
  onRouteHomeEpic
];

export const ns = 'home';
export const types = createTypes([
  'onRouteHome',
], ns)

export const routesMap = {
  [types.onRouteHome]: '/',
};

export const onRouteHome = createAction(types.onRouteHome);
