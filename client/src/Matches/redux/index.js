import {
  composeReducers,
  combineActions,
  createAction,
  createTypes,
  createAsyncTypes,
  handleActions  } from 'redux-vertical';
import { isLocationAction } from 'redux-first-router';
import { createSelector } from 'reselect';
import loadMatchesEpic from './matches-epic';

export const epics = [
  loadMatchesEpic
];

export const ns = 'matches';
export const getNS = state => state[ns];
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

export const selectedLeagueSelector = createSelector(
  state => getNS(state).selectedLeagueSlug,
  state => getNS(state).leagues,
  (leagueSlug, leagueMap) => leagueMap[leagueSlug] || {}
);

export const selectedSeasonSelector = createSelector(
  state => getNS(state).selectedLeagueSlug,
  state => getNS(state).selectedSeasonId,
  state => getNS(state).seasons,
  (leagueSlug, seasonId, leagueSeasonsMap) => {
    const seasons = leagueSeasonsMap[leagueSlug];
    const season = seasons.filter(n => n.id === seasonId)[0];
    return season;
  }
)

export const selectedGameRoundSelector = state => getNS(state).selectedGameRound;

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
      selectedLeagueSlug: leagueSlug
    }),
    [types.fetchSeasons.complete]: (state, { payload: { leagueSlug, seasons } }) => ({
      ...state,
      seasons: { 
        ...state.seasons, 
        [leagueSlug]: seasons 
      }
    }),
    [types.selectSeason]: (state, { payload: { leagueSlug, seasonSlug } }) => {
      const { [leagueSlug]: seasons } = state.seasons;
      const selected = seasons.filter(n => n.slug === seasonSlug)[0];
      const selectedSeasonId = selected && selected.id;
      return {
        ...state,
        selectedSeasonId
      }
    },
    [types.fetchSeasonEntities.complete]: (state, { payload: { seasonId, fixtures, teams, predictions }}) =>  ({  
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
    }), 
    [types.selectGameRound]: (state, { payload: gameRound }) => ({
      ...state,
      selectedGameRound: gameRound
    }),
  }),
  defaultState,
  ns
);
