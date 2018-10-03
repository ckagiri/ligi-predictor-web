/* global HOME_PATH */
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { ofType } from 'redux-observable';
import {
  types,
  fetchUserComplete,
  fetchUserError,
  noUserFound,
  hardGoTo,
  createErrorObservable
} from './';
import {
  switchMap,
  filter,
  map,
  catchError,
  defaultIfEmpty,
  tap,
  take,
  mapTo,
  withLatestFrom
} from 'rxjs/operators';
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

function fetchUserEpic(action$, state$) {
  const isLoggedIn$ = authService.isLoggedIn$();
  const axns = action$.pipe(ofType(types.fetchUser.start))
  const fetchUser = combineLatest(axns, isLoggedIn$).pipe(
    withLatestFrom(state$),
    map(([[action, isLoggedIn], state]) => {
      console.log('isloggedin', isLoggedIn)     
      debugger 
      return action;
    }),
  mapTo(fetchUserComplete({username: 'ck'}))

    // switchMap(() => {
    //   return ajax.post({ name: 'user' }).pipe(
    //     //filter(({ entities, result }) => entities && !!result),
    //     map(response => {
    //       const { entities: { user }, result } = response;
    //       if (!user[result].emailVerified) {
    //         return hardGoTo(HOME_PATH);
    //       }
    //       return fetchUserComplete(response);
    //     }),
    //     defaultIfEmpty(noUserFound()),
    //     catchError(createErrorObservable)
    //   );
    // })
  );
  const isLoadingRequired = action$.pipe(
    ofType(types.fetchUser.start),
    filter(() => !!authService.isLoggedIn()),
    tap(_ => console.log('fetchUser2222')),
    mapTo(noUserFound())
  );

  return merge(fetchUser, isLoadingRequired);
}

export default fetchUserEpic;
