var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var cors = require('cors');
var httpStatus = require('http-status');
var expressValidation = require('express-validation');
var helmet = require('helmet');
var config = require('./config/config');
var APIError = require('./helpers/APIError');
var path = require('path');
var appRoot = require('app-root-path');
var favicon = require('serve-favicon');
var debug = require('debug')('api:app');

var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');

const app = express();

debug('NODE_ENV=%s', config.env)

if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// connect mongodb by setting mongoose
const mongoUrl = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.env;
if (config.env === 'development') {
  mongoose.set('debug', config.mongooseDebug);
}
mongoose.connect(mongoUrl, { useNewUrlParser: true });
mongoose.connection.on('connected', function () {
  debug('Mongoose default connection open to ' + mongoUrl);
});

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Middlewares
app.use(express.static(path.join(appRoot.path, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', require('./routes/index.route'));
app.use('/v1', require('./routes/v1/index.route'));

app.get('*', (req, res) => {
  res.sendFile(path.join(appRoot.path, 'public/index.html'));
});

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

module.exports = app;