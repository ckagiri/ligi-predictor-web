import Matches from '../Matches';
import { ns as homeNS, routesMap as homeRoutes } from '../Matches/redux';

export default {
  ...homeRoutes
};

export const nsToComponent = {
  [homeNS]: Matches
};
