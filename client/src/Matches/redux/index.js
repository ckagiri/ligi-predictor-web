import {
  composeReducers,
  combineActions,
  createAction,
  createTypes,
  createAsyncTypes,
  handleActions  } from 'redux-vertical';
import { isLocationAction } from 'redux-first-router';

import loadMatchesEpic from './matches-epic';

export const epics = [
  loadMatchesEpic
];

export const ns = 'matches';
export const types = createTypes([ 
  'onRouteMatches',
  'loadRoute',
  'selectLeague',
  'selectSeason',
  'selectGameRound',
  createAsyncTypes('loadMatches'),
  createAsyncTypes('fetchLeagues'),
  createAsyncTypes('fetchSeasons'),
  createAsyncTypes('fetchSeasonEntities')
], ns);

export const routesMap = {
  [types.onRouteMatches]: '/matches',
};

export const onRouteMatches = createAction(types.onRouteMatches);
export const loadRoute = createAction(types.loadRoute);
export const loadMatches = createAction(types.loadMatches.start);
export const loadMatchesComplete = createAction(types.loadMatches.complete);
export const loadMatchesError = createAction(types.loadMatches.error);
export const fetchLeagues = createAction(types.fetchLeagues.start);
export const fetchLeaguesComplete = createAction(types.fetchLeagues.complete);
export const selectLeague = createAction(types.selectLeague);
export const fetchSeasons = createAction(types.fetchSeasons.start);
export const fetchSeasonsComplete = createAction(types.fetchSeasons.complete);
export const selectSeason = createAction(types.selectSeason);
export const fetchSeasonEntities = createAction(types.fetchSeasonEntities.start);
export const fetchSeasonEntitiesComplete = createAction(types.fetchSeasonEntities.complete);
export const selectGameRound = createAction(types.selectGameRound);

    // fetchLeagues()
    // fetchLeagues.start
    // hasLeagueUrl 
    // y -> selectLeague
    // n -> fetchDefaultLeague -> selectLeague
    // selectLeague.start
    // loading?
    // fetchSeasons
    // hasSeasonUrl
    // y -> selectSeason
    // n -> getCurrentSeason
    // selectSeason.start
    // fetchSeason
    // fetchSeason.complete
    // loadMatches.complete


const defaultState = {
  leagues: {},
  selectedLeagueSlug: null,
  seasons: {},
  selectedSeasonId: null,
  fixtures: {},
  predictions: {},
  teams: {},
  selectedGameRound: null,
  loaded: false,
  loading: false
}

export default handleActions(
  () => ({
    [
      combineActions(types.loadMatches.start, types.selectLeague.start, types.selectSeason.start)
    ]: state => ({  
      ...state,
      loading: true
    }),
    [types.loadMatches.error]: state => ({
      ...state,
      loading: false,
      loaded: false
    }),
    [types.loadMatches.complete]: state => ({
      ...state,
      loading:false,
      loaded: true
    }),
    [types.fetchLeagues.complete]: (state, { payload: leagues }) => {  
      const entities = leagues.reduce(
        (entities, league) => {
          return {
            ...entities,
            [league.slug]: league 
          }
        }, {
          ...state.entities
        });
      return {
        ...state,
        leagues: entities,
      }
    },
    [types.selectLeague]: (state, { payload: leagueSlug }) => ({
      ...state,
      selectedLeague: leagueSlug
    }),
    [types.fetchSeasons.complete]: (state, { payload: { leagueSlug, seasons } }) => ({
      ...state,
      leagues: { 
        ...state.leagues, 
        [leagueSlug]: seasons 
      }
    }),
    [types.selectSeason]: (state, { payload: { leagueSlug, seasonSlug } }) => {
      const { [leagueSlug]: seasons } = state.leagues;
      const selected = seasons.filter(n => n.slug === seasonSlug)[0];
      const selectedSeasonId = selected & selected.id;
      return {
        ...state,
        selectedSeasonId
      }
    },
    [types.fetchSeasons.complete]: (state, { payload: { seasonId, fixtures, teams, predictions }}) =>  ({  
      ...state,
      teams: {
        ...state.teams,
        [seasonId]: teams,
      },
      fixtures: {
        ...state.fixtures,
        [seasonId]: fixtures,
      },
      predictions: {
        ...state.predictions,
        [seasonId]: predictions
      }
    })
  }),
  defaultState,
  ns
);
