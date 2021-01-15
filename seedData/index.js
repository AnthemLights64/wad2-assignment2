import userModel from '../api/users/userModel';
import movieModel from '../api/movies/movieModel';
import {movies} from './movies.js';
import loglevel from 'loglevel';

const users = [
  {
    'username': 'user1',
    'password': 'test1',
  },
  {
    'username': 'user2',
    'password': 'test2',
  },
];

// deletes all user documents in collection and inserts test data
export async function loadUsers() {
  loglevel.info('load user Data');
  try {
    await userModel.deleteMany();
    await users.forEach(user => userModel.create(user));
    loglevel.info(`${users.length} users were successfully stored.`);
  } catch (err) {
    loglevel.error(`failed to Load user Data: ${err}`);
  }
}

// deletes all movies documents in collection and inserts test data
export async function loadMovies() {
  loglevel.info('load seed data');
  loglevel.info(movies.length);
  try {
    await movieModel.deleteMany();
    await movieModel.collection.insertMany(movies);
    loglevel.info(`${movies.length} Movies were successfully stored.`);
  } catch (err) {
    loglevel.error(`failed to Load movie Data: ${err}`);
  }
}