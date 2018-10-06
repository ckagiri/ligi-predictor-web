/* global HOME_PATH */
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { ofType } from 'redux-observable';
import {
  types,
  loadUserComplete,
  loadUserError,
  noUserFound,
  hardGoTo,
  createErrorObservable
} from '.';
import {
  switchMap,
  filter,
  map,
  catchError,
  defaultIfEmpty,
  tap,
  take,
  mapTo,
  withLatestFrom,
  mergeMap
} from 'rxjs/operators';
import { iif } from 'rxjs';
import { ajax } from 'rxjs/ajax'
import { authService } from '../auth-service';
//import { combineLatest } from 'rxjs';
import { combineLatest } from "rxjs/observable/combineLatest";


// this.store.select(fromStore.getSelectedLeague).pipe(
//   filter(league => !!league),
//   take(1),
//   combineLatest(this.store.select(fromStore.getSeasonsLoaded)),
//   tap(([selectedLeague, seasonsLoaded]) => {
//     if (!seasonsLoaded) {         
//       this.store.dispatch(new fromStore.LoadSeasons(selectedLeague.id));
//     }
//   }),
//   map(([league, seasonsLoaded]) => seasonsLoaded),      
//   filter(loaded => loaded),
//   take(1)       

function loadUserEpic(action$, state$) {
  return combineLatest(
    action$.pipe(ofType(types.loadUser.start)), 
    authService.currentUser$).pipe(
      withLatestFrom(state$),
      switchMap(([[action, currentUser], state]) => {
        if(!currentUser) {
          authService.login('kevo') 
        }
        return of(loadUserComplete(currentUser))
      })
    );
}

export default loadUserEpic;
