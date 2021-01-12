import express from 'express';
import { getMovieReviews } from '../tmdb-api';
import movieModel from './movieModel';

const router = express.Router();

router.get('/', (req, res, next) => {
  movieModel.find().then(movies => res.status(200).send(movies)).catch(next);
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (movieModel.findByMovieDBId(id)) {
    movieModel.findByMovieDBId(id)
      .then(movie => res.status(200).send(movie))
      .catch((error) => next(error));
  } else {
    res.status(404).catch((error) => next(error));
  }
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
    await movieModel.create(newMovie).catch(next);
    res.status(201).send(newMovie);
  } else {
    res.status(405).send({
      message: "Invalid Movie Data",
      status: 405
    });
  }
});

// Update a movie
router.put('/:id', async (req, res, next) => {
  const key = parseInt(req.params.id);
  const updateMovie = req.body;
  if (movieModel.findByMovieDBId(key)) {
    !updateMovie.id ? updateMovie.id = key : updateMovie;
    if (req.body._id) delete req.body._id;
    await movieModel.findOneAndUpdate({_id: updateMovie._id}, updateMovie).catch(next);
    res.status(200).json(updateMovie);
  } else {
    res.status(404).send({
      message: 'Unable to find Movie',
      status: 404
    });
  }
});

// Delete a moive
router.delete('/:id', async (req, res) => {
  const key = parseInt(req.params.id);
  if (movieModel.findByMovieDBId(key)) {
    await movieModel.deleteOne({"id":key});
    res.status(200).send({message: `Deleted movie id: ${key}.`,status: 200});
  } else {
    res.status(404).send({message: `Unable to find movie with id: ${key}.`, status: 404});
  }
});

export default router;