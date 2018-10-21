module.exports = function() {
  const service = {
    getJsonFromFile: getJsonFromFile
  };
  return service;

  function getJsonFromFile(file) {
    const fs = require('fs');
    const json = getConfig(file);
    return json;

    function readJsonFileSync(filepath, encoding) {
      if (typeof (encoding) === 'undefined') {
        encoding = 'utf8';
      }
      const file = fs.readFileSync(filepath, encoding);
      return JSON.parse(file);
    }

    function getConfig(file) {
      const filepath = __dirname + file;
      return readJsonFileSync(filepath);
    }
  }
};