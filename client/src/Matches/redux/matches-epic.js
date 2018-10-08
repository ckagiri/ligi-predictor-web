/* global HOME_PATH */
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { ofType, combineEpics } from 'redux-observable';
import { createErrorObservable } from '../../redux';
import { types, onRouteMatches } from '.';
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
import { redirect } from 'redux-first-router';
import { loadMatches, loadMatchesComplete } from '.';

function loadMatchesEpic(action$) {
  return action$.pipe(
    ofType(types.loadMatches.start),
    tap(_ => console.log('loadMatches')),
    delay(1000),
    mapTo(loadMatchesComplete([])),
    catchError(createErrorObservable));
}

function loadRouteEpic(actions$) {
  const loadMatches$ = actions$.pipe(
    ofType(types.loadRoute),
    mapTo(loadMatches()));

  const redirect$ = actions$.pipe(
    ofType(types.loadMatches.complete),
    mapTo(redirect(onRouteMatches({ query: { league: "epl" }})))
  )

  return merge(loadMatches$, redirect$);
}

export default combineEpics(loadRouteEpic, loadMatchesEpic)
