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
      res.status(200).send(movie);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Неверно введены данные');
      }
    })
    .catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError('недостаточно прав для выполнения операции');
      }
      Movie.findByIdAndDelete(req.params._id)
        .then(() => res.status(200).send({ message: 'карточка успешно удалена' }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Переданы неверные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы неверные данные'));
      } else {
        next(err);
      }
    });
};
