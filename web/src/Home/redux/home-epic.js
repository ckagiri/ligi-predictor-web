import { ofType, combineEpics } from 'redux-observable';
import { types } from '.';
import {
  tap,
  map
} from 'rxjs/operators';
import { redirect } from 'redux-first-router';
import { onRouteMatches } from '../../Matches/redux';

function onRouteHomeEpic(action$) {
  return action$.pipe(
    ofType(types.onRouteHome),
    tap((action) => console.log('homeEpic', action)),
    map(() => {
      return redirect(onRouteMatches());
    })
  )
}

export default onRouteHomeEpic;
