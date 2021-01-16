import userModel from '../api/users/userModel';
import movieModel from '../api/movies/movieModel';
import upcomingModel from '../api/upcomings/upcomingModel';
import actorModel from '../api/actors/actorModel';
import {movies} from './movies.js';
import {upcomings} from './upcomings.js';
import { getActors } from '../api/tmdb-api';
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

// deletes all upcoming movies documents in collection and inserts test data
export async function loadUpcomings() {
  loglevel.info('load seed data');
  loglevel.info(upcomings.length);
  try {
    await upcomingModel.deleteMany();
    await upcomingModel.collection.insertMany(upcomings);
    loglevel.info(`${upcomings.length} Upcoming movies were successfully stored.`);
  } catch (err) {
    loglevel.error(`failed to Load upcoming movie Data: ${err}`);
  }
}

export async function loadActors() {
  loglevel.log('load seed data');
  try {
    getActors().then(async res =>{
      await actorModel.deleteMany();
      await actorModel.collection.insertMany(res);
      loglevel.info(`${res.length} actors were successfully stored.`);
    })
  } catch (err) {
    console.error(`failed to Load actor Data: ${err}`);
  }
}
