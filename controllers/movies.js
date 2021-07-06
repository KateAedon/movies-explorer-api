const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.addMovie = (req, res, next) => {
  const owner = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

<<<<<<< HEAD
=======
  if (!country
    || !director
    || !duration
    || !year
    || !description
    || !image
    || !trailer
    || !nameRU
    || !nameEN
    || !thumbnail
    || !movieId) {
    throw new BadRequestError('Введены некоррекные данные');
  }

>>>>>>> 15adb2983fa2395805194a4b5e664c5f1f1c536c
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
    movieId,
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
<<<<<<< HEAD
  const { movieId } = req.params;
  Movie.findById(movieId).select('+owner')
=======
  Movie.findById(req.params.movieId)
>>>>>>> 15adb2983fa2395805194a4b5e664c5f1f1c536c
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      }

      if (String(movie.owner) !== req.user._id) {
        throw new ForbiddenError('недостаточно прав для выполнения операции');
      }
<<<<<<< HEAD
      return Movie.findByIdAndRemove(movieId).select('-owner')
        .then(() => res.send({ message: 'фильм удален из сохраненных' }));
=======
      movie.remove().then(() => res.send({ message: 'фильм удален из сохраненных' }));
>>>>>>> 15adb2983fa2395805194a4b5e664c5f1f1c536c
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы неверные данные'));
      } else {
        next(err);
      }
    });
};
