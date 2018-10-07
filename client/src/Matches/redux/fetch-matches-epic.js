/* global HOME_PATH */
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { ofType } from 'redux-observable';
import {
  types,
  createErrorObservable
} from '../../redux';
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

function fetchMatchesEpic(action$) {
  return action$.pipe(
    ofType(types.appMounted),
    tap(_ => console.log('appmounted')),
    delay(1000),
    map(res => {
      return { type: 'fetchMatchesComplete', payload: [] }
    }),
    catchError(createErrorObservable)
  )
}

export default fetchMatchesEpic;
