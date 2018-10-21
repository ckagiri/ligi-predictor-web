import { epics as app } from './redux';
import { epics as home } from './home/redux';
import { epics as matches } from './matches/redux'

export default [
  ...app,
  ...home,
  ...matches
];
