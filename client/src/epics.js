import { epics as app } from './redux';
import { epics as nav } from './Nav/redux';
import { epics as settings } from './routes/Settings/redux';

export default [
  ...app,
  ...nav,
  ...settings
];
