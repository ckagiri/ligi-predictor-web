import { types } from './redux';

export { default } from './ShowSettings';

export const routesMap = {
  [types.onRouteSettings]: '/settings',
  [types.onRouteUpdateEmail]: '/settings/update-email'
};
