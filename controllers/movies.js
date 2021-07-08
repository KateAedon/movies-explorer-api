const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).select('+owner')
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.addMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailer: req.body.trailer,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    thumbnail: req.body.thumbnail,
    owner: req.user._id,
    movieId: req.body.movieId,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Неверно введены данные');
      }
    })
    .catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId).select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      }

      if (String(movie.owner) !== req.user._id) {
        throw new ForbiddenError('недостаточно прав для выполнения операции');
      }
      return Movie.findByIdAndRemove(movieId).select('-owner')
        .then(() => res.send({ message: 'фильм удален из сохраненных' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы неверные данные'));
      } else {
        next(err);
      }
    });
};
