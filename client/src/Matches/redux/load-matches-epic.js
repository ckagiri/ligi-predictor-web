/* global HOME_PATH */
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { ofType, combineEpics } from 'redux-observable';
import { createErrorObservable } from '../../redux';
import { types } from '.';
import {
  switchMap,
  tap,
  filter,
  map,
  catchError, 
  delay,
  defaultIfEmpty,
  mapTo
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax'
import { redirect } from 'redux-first-router';
import { onRouteMatches, loadMatchesComplete } from './';

function loadMatchesEpic(action$) {
  const loadMatches$ = action$.pipe(
    ofType(types.loadMatches.start),
    tap(_ => console.log('loadMatches')),
    delay(1000),
    mapTo(loadMatchesComplete([])),
    catchError(createErrorObservable))

  const gotoRouteMatches$ = action$.pipe(
    ofType(types.loadMatches.complete),
    mapTo(redirect(onRouteMatches({ query: { league: 'epl' } }))))

  return merge(loadMatches$, gotoRouteMatches$)
}

export default combineEpics(loadMatchesEpic)
