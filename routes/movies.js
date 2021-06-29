const moviesRouter = require('express').Router();
const { validateMovie, validateMovieId } = require('../middlewares/validator');

const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', validateMovie, addMovie);
moviesRouter.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;
