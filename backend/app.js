var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var cors = require('cors');
var httpStatus = require('http-status');
var expressValidation = require('express-validation');
var helmet = require('helmet');
var routes = require('./routes/index.route');
var config = require('./config/config');
var APIError = require('./helpers/APIError');
var path = require('path');
var appRoot = require('app-root-path');
var favicon = require('serve-favicon');

var swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc')

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

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

var swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Community-rewards API',
      version: '1.0.0',
      description: 'Community-rewards backend API'
    },
    host: 'localhost:3000',
    basePath: '/api'
  },
  apis: ['./routes/*.route.js']
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

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

var Web3 = require('web3');
var web3 = new Web3(config.web3Provider);

web3.eth.getCoinbase().then(coinbase => {
  console.log("Coinbase:", coinbase)
});

module.exports = app;