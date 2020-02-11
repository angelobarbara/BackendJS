const express = require('express');
const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');

const { logErrors, wrapErrors, errorHandler } = require('./utils/middleware/errorHandlers');
const notFoundHandler = require('./utils/middleware/notFoundHandler');

const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');

// body parser
app.use(express.json())

// routes
moviesApi(app)

// catch Error 404
app.use(notFoundHandler)

// erros middleware
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})

//Logger
app.use(morgan('combined', { stream: accessLogStream }))

app.listen(config.port, function() {
  console.log(`Listening http://localhost:${config.port}`);
});
