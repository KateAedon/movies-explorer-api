const moviesRouter = require('express').Router();
const { validateMovie, validateMovieId } = require('../middlewares/validator');

const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', addMovie);
moviesRouter.delete('/movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;
