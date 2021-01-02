import session from 'express-session';
import passport from './authenticate';
import {loadUsers, loadMovies} from './seedData';
import './db';
import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import genresRouter from './api/genres';
import bodyParser from 'body-parser';
import usersRouter from './api/users';
import loglevel from 'loglevel';

dotenv.config();

if (process.env.SEED_DB) {
  loadUsers();
  loadMovies();
}

const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍, ${err.stack} `);
};

const YAML = require('yamljs');
var swaggerui=require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

const port = process.env.PORT;

//session middleware
app.use(session({
  secret: 'ilikecake',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static('public'));
//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(passport.initialize());
app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/genres', genresRouter);
//Users router
app.use('/api/users', usersRouter);
app.use(errHandler);

app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument));

let server = app.listen(port, () => {
  loglevel.info(`Server running at ${port}`);
});

module.exports = server;