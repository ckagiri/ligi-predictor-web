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
  ignoreElements,
  mapTo
} from 'rxjs/operators';
import { redirect, replace } from 'redux-first-router';
import { stringify as queryString } from 'query-string';
 
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
  setGameRound,
  selectGameRoundComplete,
  selectedLeagueSelector, 
  selectedSeasonSelector,
  selectedRoundSelector
} from '.';
import { 
  paramsSelector, pathnameSelector, querySelector, locationTypeSelector, routesMapSelector 
} from '../../router/redux';
import { leagueDataService, seasonDataService } from '../../dataservices';

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
      const round = selectedRoundSelector(state);
      return redirect(onRouteMatches({ query: { league, season, round } }))
    })
  )

  return merge(loadMatches$, redirect$);
}

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

  const setGameRound$ = action$.pipe(
    ofType(types.fetchSeasonEntities.complete),
    withLatestFrom(state$),
    map(([action, state]) => {
      return setGameRound(1);
    }));

  const loadMatchesComplete$ = action$.pipe(
    ofType(types.setGameRound),
    mapTo(loadMatchesComplete()));

  return merge(loadMatches$, fetchLeagues$, selectLeague$, fetchSeasons$, 
    selectSeason$, fetchSeasonEntities$, setGameRound$, loadMatchesComplete$);
}


function gameRoundEpic(action$, state$) {
  return action$.pipe(
    ofType(types.selectGameRound.start),
    withLatestFrom(state$),
    map(([action, state]) => {
      const pathname = pathnameSelector(state);
      const query = querySelector(state);
      const round = +query.round === 1 ? 2 : 1;
      const search = `?${queryString({ ...query, round })}`;
      replace(pathname+search)
      return selectGameRoundComplete(round);
    }))
}

export default combineEpics(loadRouteEpic, loadMatchesEpic, gameRoundEpic)
