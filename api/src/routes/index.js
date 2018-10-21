module.exports = function(app) {
  const api = '/api';
  const data = '/../../data/';
  const jsonFileService = require('./utils/jsonFileService')();

  app.get(`${api}/leagues/:slug`, getLeague);
  app.get(`${api}/leagues`, getLeagues);
  app.get(`${api}/leagues/default`, getDefaultLeague)
  app.get(`${api}/leagues/:leagueSlug/seasons`, getSeasons);
  app.get(`${api}/leagues/:leagueSlug/seasons/default`, getDefaultSeason);
  app.get(`${api}/leagues/:leagueSlug/seasons/:seasonSlug`, getSeason);
  app.get(`${api}/leagues/:leagueSlug/seasons/:seasonSlug/entities`, getSeasonEntities);

  function getLeague(req, res, next) {
    const json = jsonFileService.getJsonFromFile(data + 'leagues.json');
    const leagues = json.filter(function(c) {
      return c.slug === req.params.slug;
    });
    res.send(leagues[0]);
  }

  function getLeagues(req, res, next) {
    const json = jsonFileService.getJsonFromFile(data + 'leagues.json');
    res.send(json);
  }  

  function getDefaultLeague(req, res, next) {
    const json = jsonFileService.getJsonFromFile(data + 'leagues.json');
    res.send(json[0]);
  }

  function getSeasons(req, res, next) {
    const json = jsonFileService.getJsonFromFile(data + 'seasons.json');
    const seasons = json.filter(function(c) {
      return c.leagueSlug === req.params.leagueSlug;
    });
    res.send(seasons);
  }

  function getDefaultSeason(req, res, next) {
    const json = jsonFileService.getJsonFromFile(data + 'seasons.json');
    const seasons = json.filter(function(c) {
      return c.leagueSlug === req.params.leagueSlug;
    });
    res.send(seasons[0]);
  } 

  function getSeason(req, res, next) {
    const json = jsonFileService.getJsonFromFile(data + 'seasons.json');
    const season = json.find(function(c) {
      return c.leagueSlug === req.params.leagueSlug && c.slug === req.params.seasonSlug;
    });
    res.send(season);
  }

  function getSeasonEntities(req, res, next) {
    const teams =  jsonFileService.getJsonFromFile(data + 'teams.json');
    const fixtures =  jsonFileService.getJsonFromFile(data + 'fixtures.json');
    const predictions =  jsonFileService.getJsonFromFile(data + 'predictions.json');

    res.send({
      teams,
      fixtures,
      predictions,
    });
  }
};