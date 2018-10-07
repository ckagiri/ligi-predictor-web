/* global HOME_PATH */
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { ofType, combineEpics } from 'redux-observable';
import { createErrorObservable } from '../../redux';
import { types } from './';
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

function fetchMatchesEpic(action$) {
  return action$.pipe(
    tap(action => console.log('fethmathes', action)),
    ofType(types.appMounted),
    tap(_ => console.log('appmounted')),
    delay(1000),
    map(res => {
      return { type: 'fetchMatchesComplete', payload: [] }
    }),
    catchError(createErrorObservable)
  )
}


export default combineEpics(fetchMatchesEpic)
