import Home from '../home';
import Matches from '../matches';
import { ns as homeNs, routesMap as homeRoutes } from '../home/redux';
import { ns as matchesNS, routesMap as matchesRoutes } from '../matches/redux';

export default {
  ...homeRoutes,
  ...matchesRoutes
};

export const nsToComponent = {
  [homeNs]: Home,
  [matchesNS]: Matches
};
