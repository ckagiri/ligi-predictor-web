import { epics as app } from './redux';
import { epics as matches } from './Matches/redux'

export default [
  ...app,
  ...matches
];
