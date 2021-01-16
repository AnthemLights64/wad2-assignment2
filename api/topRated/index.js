import express from 'express';
import { getMovieReviews } from '../tmdb-api';
import topRatedModel from './topRatedModel';

const router = express.Router();

router.get('/', (req, res, next) => {
  topRatedModel.find().then(movies => res.status(200).send(movies)).catch(next);
});

router.get('/:id', async (req, res, next) => {
    if ( isNaN(req.params.id) ) return res.status(404).json({
      code: 404,
      msg: "The id should be a number."
    });
    const id = parseInt(req.params.id);
    const movie = await topRatedModel.findByMovieDBId(id);
    if ( !movie ) return res.status(404).json({
      code: 404,
      msg: "The movie could not be found."
    });
    res.status(200).json(movie).catch((error) => next(error));
  });
  
  router.get('/:id/reviews', (req, res, next) => {
    const id = parseInt(req.params.id);
    getMovieReviews(id)
    .then(reviews => res.status(200).send(reviews))
    .catch((error) => next(error));
  });
  
  // Add a movie
  router.post('/', async (req, res, next) => {
    let newMovie = req.body;
    if (newMovie && newMovie.title) {
      //Adds a random id if missing. 
      !newMovie.id ? newMovie.id = Math.round(Math.random() * 10000) : newMovie;
      await topRatedModel.create(newMovie).catch(next);
      res.status(201).send(newMovie);
    } else {
      res.status(405).send({
        status: 405,
        message: "Please include a title."
      });
    }
  });
  
  // Delete a moive
  router.delete('/:id', async (req, res) => {
    if ( isNaN(req.params.id) ) return res.status(404).json({
      status: 404,
      msg: "The id is invalid."
    });
    const key = parseInt(req.params.id);
    const movie = await topRatedModel.findByMovieDBId(key);
    if (!movie) {
      res.status(404).send({message: `Unable to find movie with id: ${key}.`, status: 404});
    } else {
      await topRatedModel.deleteOne({"id":key});
      res.status(200).send({message: `Deleted movie id: ${key}.`,status: 200});
    }
  });


export default router;