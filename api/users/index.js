import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import movieModel from '../movies/movieModel';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', (req, res, next) => {
  User.find().then(users =>  res.status(200).json(users)).catch(next);
});

//login
router.post('/login', async (req,res,next) => {
  if (!req.body.username || !req.body.password) {
    res.status(402).json({
      success: false,
      msg: 'Please pass username and password.',
    });
  }
  const user = await User.findByUserName(req.body.username).catch(next);
      if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.username, process.env.SECRET);
          // return the information including token as JSON
          res.status(200).json({
            success: true,
            token: 'BEARER ' + token,
          });
        } else {
            return res.status(401).json({
              code: 401,
              msg: 'Authentication failed. Wrong password.'
            });
        }
      });
} );
//register
router.post('/', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(402).json({
      success: false,
      msg: 'Please pass username and password.',
    });
  }
  const goodPwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    if (!req.body.password.match(goodPwd)) {
      res.status(401).json({
        code: 401,
        msg: 'Register failed for bad password.'
      });
    } else {
      await User.create(req.body).catch(next);
      return res.status(201).json({
        code: 201,
        msg: 'Successfully created new user.',
      });
    }    
});

// Update a user
router.put('/:userName', async (req, res, next) => {
  const key = req.params.userName;
  const user = await User.findByUserName(key);
  if (!user) return res.status(404).json({ code: 404, msg: 'Unable to find user.' });
  User.updateOne({
    _id: user._id,
  }, req.body, {
    upsert: false,
  })
  .then(res.status(200).json({ code: 200, msg: 'The user is successfully updated.' }))
  .catch(next);
});

//Add a favourite. With Error Handling. Can't add duplicates.
router.post('/:userName/favourites', async (req, res, next) => {
  try{
    const newFavourite = req.body.id;
    const userName = req.params.userName;
    const movie = await movieModel.findByMovieDBId(newFavourite);
    if (!movie) return res.status(404).json({ code: 404, msg: 'Unable to find movie.' });
    const user = await User.findByUserName(userName);
    if (user.favourites.indexOf(movie._id) === -1) {
      await user.favourites.push(movie._id);
    } else {
      return res.status(401).json({
        msg: "This movie is already in favourites.",
        user
      });
    }
    await user.save(); 
    res.status(201).json(user); 
  } catch(err) {
    next(err);
  }
});

router.get('/:userName/favourites', (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate('favourites').then(
    user => res.status(201).json(user.favourites)
  ).catch(next);
});

router.delete('/:userName/favourites/:id', async (req, res) => {
  const userName = req.params.userName;
  const user = await User.findByUserName(userName);
  if (!user) return res.status(404).json({ code: 404, msg: 'User cannot be found.' });
  if (isNaN(req.params.id)) return res.status(403).json({ code: 403, msg: 'Invaild movie id.' });
  const id = parseInt(req.params.id);
  const movie = await movieModel.findByMovieDBId(id);
  if (user.favourites.indexOf(movie.id) !== -1) {
    await user.removeFromFavourites(id);
  } else {
    return res.status(401).json({
      msg: "This movie is not in favourites.",
      user
    });
  }
  await user.save(); 
  res.status(200).send({ code: 200, msg: "Successfully deleted."});
});

// Add to watchlist
router.post('/:userName/watchlist', async (req, res, next) => {
  try{
    const newWatchlist = req.body.id;
    const userName = req.params.userName;
    const movie = await movieModel.findByMovieDBId(newWatchlist);
    if (!movie) return res.status(404).json({ code: 404, msg: 'Unable to find movie.' });
    const user = await User.findByUserName(userName);
    if (user.watchlist.indexOf(movie._id) === -1) {
      await user.watchlist.push(movie._id);
    } else {
      return res.status(401).json({
        msg: "This movie is already in watchlist.",
        user
      });
    }
    await user.save(); 
    res.status(201).json(user); 
  } catch(err) {
    next(err);
  }
});

router.get('/:userName/watchlist', (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate('watchlist').then(
    user => res.status(201).json(user.watchlist)
  ).catch(next);
});

router.delete('/:userName/watchlist/:id', async (req, res) => {
  const userName = req.params.userName;
  const user = await User.findByUserName(userName);
  if (!user) return res.status(404).json({ code: 404, msg: 'User cannot be found.' });
  if (isNaN(req.params.id)) return res.status(403).json({ code: 403, msg: 'Invaild movie id.' });
  const id = parseInt(req.params.id);
  const movie = await movieModel.findByMovieDBId(id);
  if (user.watchlist.indexOf(movie.id) !== -1) {
    await user.removeFromWatchlist(id);
  } else {
    return res.status(401).json({
      msg: "This movie is not in watchlist.",
      user
    });
  }
  await user.save(); 
  res.status(200).send({ code: 200, msg: "Successfully deleted."});
});

export default router;