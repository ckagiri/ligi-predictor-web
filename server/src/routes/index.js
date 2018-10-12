module.exports = function(app) {
  const api = '/api';
  const data = '/../../data/';
  const jsonFileService = require('./utils/jsonFileService')();

  app.get(api + '/leagues/:id', getLeague);
  app.get(api + '/leagues', getLeagues);

  function getLeague(req, res, next) {
      const json = jsonFileService.getJsonFromFile(data + 'leagues.json');
      const league = json.filter(function(c) {
        return c.id === parseInt(req.params.id);
      });
      res.send(league[0]);
  }

  function getLeagues(req, res, next) {
      const json = jsonFileService.getJsonFromFile(data + 'leagues.json');
      res.send(json);
  }  
};