import { ofType, combineEpics } from 'redux-observable';
import { types } from './';
import {
  tap,
  map,
} from 'rxjs/operators';
import { push, redirect } from 'redux-first-router';

function onRouteHomeEpic(action$) {
  return action$.pipe(
    tap((action) => console.log('homeEpic', action)),
    ofType(types.onRouteHome),
    map(() => {
      debugger
      push('/matches')
    })
  )
}

export default onRouteHomeEpic;
