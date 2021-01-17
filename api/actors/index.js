import express from 'express';
import {getPerson} from '../tmdb-api';
import actorModel from './actorModel';

const router = express.Router();

router.get('/', (req, res, next) => {
  actorModel.find().then(actors => res.status(200).send(actors)).catch(next);
});

// router.get('/:id', async (req, res, next) => {
//   if ( isNaN(req.params.id) ) return res.status(404).json({
//     code: 404,
//     msg: "The id should be a number."
//   });
//   const id = parseInt(req.params.id);
//   const actor = await actorModel.findByActorDBId(id);
//   if ( !actor ) return res.status(404).json({
//     code: 404,
//     msg: "The actor could not be found."
//   });
//   res.status(200).json(actor).catch((error) => next(error));
// });

router.get('/:id', async (req, res, next) => {
  if (isNaN(req.params.id)) return res.status(403).json({ code: 403, msg: 'Invaild movie id.' });
  const id = parseInt(req.params.id);
  const person = await getPerson(id);
  if (!person) return res.status(404).json({ code: 404, msg: 'The resource you requested could not be found.' });
  res.status(200).json(person);
});

// Add an actor
router.post('/', async (req, res, next) => {
  let newactor = req.body;
  if (newactor && newactor.name) {
    //Adds a random id if missing. 
    !newactor.id ? newactor.id = Math.round(Math.random() * 10000) : newactor;
    await actorModel.create(newactor).catch(next);
    res.status(201).send(newactor);
  } else {
    res.status(405).send({
      status: 405,
      message: "Please include a name."
    });
  }
});

// Update an actor
router.put('/:id', async (req, res, next) => {
  if ( isNaN(req.params.id) ) return res.status(404).json({
    status: 404,
    msg: "The id is invalid."
  });
  const key = parseInt(req.params.id);
  const updateactor = req.body;
  const actor = await actorModel.findByactorDBId(key);
  if (!actor) {
    res.status(404).send({
      message: 'Unable to find actor',
      status: 404
    });
  } else {
    !updateactor.id ? updateactor.id = key : updateactor;
    if (req.body._id) delete req.body._id;
    await actorModel.updateOne({id: key}, updateactor).catch(next);
    res.status(200).json(updateactor);
  }
});

// Delete an actor
router.delete('/:id', async (req, res) => {
  if ( isNaN(req.params.id) ) return res.status(404).json({
    status: 404,
    msg: "The id is invalid."
  });
  const key = parseInt(req.params.id);
  const actor = await actorModel.findByactorDBId(key);
  if (!actor) {
    res.status(404).send({message: `Unable to find actor with id: ${key}.`, status: 404});
  } else {
    await actorModel.deleteOne({"id":key});
    res.status(200).send({message: `Deleted actor id: ${key}.`,status: 200});
  }
});

export default router;