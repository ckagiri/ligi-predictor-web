import Home from '../Home';
import Matches from '../Matches';
import { ns as homeNs, routesMap as homeRoutes } from '../Home/redux';
import { ns as matchesNS, routesMap as matchesRoutes } from '../Matches/redux';

export default {
  ...homeRoutes,
  ...matchesRoutes
};

export const nsToComponent = {
  [homeNs]: Home,
  [matchesNS]: Matches
};
