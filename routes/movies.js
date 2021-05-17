const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const {
  getMovies,
  deleteMovieById,
  createMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovieById);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(30),
    image: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value, { require_protocol: true })) return helpers.error('Невалидная ссылка');
      return value;
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value, { require_protocol: true })) return helpers.error('Невалидная ссылка');
      return value;
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value, { require_protocol: true })) return helpers.error('Невалидная ссылка');
      return value;
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
}), createMovie);

module.exports = router;
