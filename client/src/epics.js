import { epics as app } from './redux';
import { epics as home } from './Home/redux';
import { epics as matches } from './Matches/redux'

export default [
  ...app,
  ...home,
  ...matches
];
