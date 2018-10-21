/* global HOME_PATH */
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { ofType, combineEpics } from 'redux-observable';
import { createErrorObservable, doActionOnError } from '../../redux';
import { types, onRouteMatches } from '.';
import {
  tap,
  map,
  catchError, 
  delay,
  mergeMap,
  withLatestFrom,
  mapTo
} from 'rxjs/operators';
import { redirect } from 'redux-first-router';
import { 
  loadMatches, 
  loadMatchesComplete, 
  loadMatchesError,
  fetchLeagues,
  fetchLeaguesComplete,
  selectLeague,
  fetchSeasons,
  fetchSeasonsComplete,
  selectSeason,
  fetchSeasonEntitiesComplete
} from '.';

import { leagueDataService, seasonDataService } from '../../dataservices';

function loadMatchesEpic(action$, state$) {
  const loadMatches$ = action$.pipe(
    ofType(types.loadMatches.start),
    delay(1000),
    mapTo(fetchLeagues()))

  const fetchLeagues$ = action$.pipe(
    ofType(types.fetchLeagues.start),
    mergeMap(() => leagueDataService.fetchLeagues().pipe(
      map(response => fetchLeaguesComplete(response)),
      // Todo: handle server-error
      catchError(doActionOnError(error => loadMatchesError(error)))
    )))

  const selectLeague$ = action$.pipe(
    ofType(types.fetchLeagues.complete),
    withLatestFrom(state$),
    map(([action, state]) => {
      const leagueSlug = 'english-premier-league';
      return selectLeague(leagueSlug);
    }))


  const fetchSeasons$ = action$.pipe(
    ofType(types.selectLeague),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const leagueSlug = 'english-premier-league';
      return seasonDataService.fetchSeasons(leagueSlug).pipe(
        map(response => fetchSeasonsComplete(response)),
        // Todo: handle server-error
        catchError(doActionOnError(error => loadMatchesError(error))))
    }))
    
  const selectSeason$ = action$.pipe(
    ofType(types.fetchSeasons.complete),
    withLatestFrom(state$),
    map(([action, state]) => {
      const leagueSlug = 'english-premier-league';
      const seasonSlug = '18-19';
      return selectSeason({ leagueSlug, seasonSlug });
    }))
  

  const fetchSeasonEntities$ = action$.pipe(
    ofType(types.selectSeason),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const leagueSlug = 'english-premier-league';
      return seasonDataService.fetchSeasonEntities(leagueSlug).pipe(
        map(response => fetchSeasonEntitiesComplete(response)),
        // Todo: handle server-error
        catchError(doActionOnError(error => loadMatchesError(error))))
    }))

  return merge(loadMatches$, fetchLeagues$, selectLeague$, 
    fetchSeasons$, selectSeason$, fetchSeasonEntities$);
}

function loadRouteEpic(action$) {
  const loadMatches$ = action$.pipe(
    ofType(types.loadRoute),
    mapTo(loadMatches()));

  const redirect$ = action$.pipe(
    ofType(types.loadMatches.complete),
    mapTo(redirect(onRouteMatches({ query: { league: "epl" }})))
  )

  return merge(loadMatches$, redirect$);
}

export default combineEpics(loadRouteEpic, loadMatchesEpic)
