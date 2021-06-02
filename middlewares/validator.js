const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const validateUrl = (url) => {
  if (!validator.isURL(url, { require_protocol: true })) {
    throw new CelebrateError('Некорректный URL');
  }
  return url;
};

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required().custom(validateUrl),
    trailer: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports = {
  validateUrl,
  validateUser,
  validateLogin,
  validateMovie,
  validateUserUpdate,
  validateMovieId
};
