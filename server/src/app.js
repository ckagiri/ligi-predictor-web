const dotenv = require('dotenv');
dotenv.load({ path: '.env' });
if (!process.env.NODE_ENV) {
  // if (dotenv.error) {
  console.error(
    'ENV constiables are missing.',
    'Verify that you have set them directly or in a .env file.'
  );
  process.exit(1);
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const errorHandler = require('./routes/utils/errorHandler')();
const favicon = require('serve-favicon');
const logger = require('morgan');
const port = process.env.PORT || 7203;
let routes;

const environment = process.env.NODE_ENV;

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(compress());
app.use(logger('dev'));
app.use(cors());
app.use(errorHandler.init);

routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/ping', function(req, res, next) {
  console.log(req.body);
  res.send('pong');
});

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') +
              '\n__dirname = ' + __dirname +
              '\nprocess.cwd = ' + process.cwd());
});