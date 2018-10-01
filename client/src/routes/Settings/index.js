import { types } from './redux';

export { default } from './ShowSettings';

export const routes = {
  [types.onRouteSettings]: '/settings',
  [types.onRouteUpdateEmail]: '/settings/update-email'
};
