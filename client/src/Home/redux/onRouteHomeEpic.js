import { ofType, combineEpics } from 'redux-observable';
import { types } from './';
import {
  tap,
  map
} from 'rxjs/operators';
import { of } from 'rxjs';

import { push, redirect } from 'redux-first-router';
import { loadMatches } from '../../Matches/redux';

function onRouteHomeEpic(action$) {
  return action$.pipe(
    ofType(types.onRouteHome),
    tap((action) => console.log('homeEpic', action)),
    map(() => {
      return loadMatches();
    })
  )
}

export default onRouteHomeEpic;
