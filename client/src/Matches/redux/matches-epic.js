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
  fetchSeasonsComplete,
  selectSeason,
  fetchSeasonEntitiesComplete,
  selectGameRound,
  selectedLeagueSelector, 
  selectedSeasonSelector,
  selectedGameRoundSelector
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
        map(response => fetchSeasonsComplete({ leagueSlug, seasons: response})),
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
    mergeMap(([_, state]) => {
      const leagueSlug = selectedLeagueSelector(state).slug;
      const selectedSeason = selectedSeasonSelector(state);
      const { id: seasonId, slug: seasonSlug } = selectedSeason;
      return seasonDataService.fetchSeasonEntities(leagueSlug, seasonSlug).pipe(
        map(response => fetchSeasonEntitiesComplete({ seasonId, ...response })),
        catchError(doActionOnError(error => loadMatchesError(error))))
    }))

  const selectGameRound$ = action$.pipe(
    ofType(types.fetchSeasonEntities.complete),
    withLatestFrom(state$),
    map(([action, state]) => {
      return selectGameRound(1);
    }));

  const loadMatchesComplete$ = action$.pipe(
    ofType(types.selectGameRound),
    mapTo(loadMatchesComplete()));

  return merge(loadMatches$, fetchLeagues$, selectLeague$, fetchSeasons$, 
    selectSeason$, fetchSeasonEntities$, selectGameRound$, loadMatchesComplete$);
  }

function loadRouteEpic(action$, state$) {
  const loadMatches$ = action$.pipe(
    ofType(types.loadRoute),
    mapTo(loadMatches()));

  const redirect$ = action$.pipe(
    ofType(types.loadMatches.complete),
    withLatestFrom(state$),
    map(([_, state]) => {
      const league = selectedLeagueSelector(state).slug;
      const season = selectedSeasonSelector(state).slug;
      const round = selectedGameRoundSelector(state);
      return redirect(onRouteMatches({ query: { league, season, round } }))
    })
  )

  return merge(loadMatches$, redirect$);
}

export default combineEpics(loadRouteEpic, loadMatchesEpic)
