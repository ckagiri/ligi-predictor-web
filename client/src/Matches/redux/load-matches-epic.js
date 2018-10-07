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
import { push, redirect } from 'redux-first-router';

function loadMatchesEpic(action$) {
  return action$.pipe(
    ofType(types.loadMatches),
    tap(_ => console.log('loadMatches')),
    delay(1000),
    map(res => {
      return { type: 'loadMatchesComplete', payload: [] }
    }),
    catchError(createErrorObservable)
  )
}


export default combineEpics(loadMatchesEpic)
