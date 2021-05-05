const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  deleteMovieById,
  createMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

// router.delete('/:movieId', celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().required().hex().length(24),
//   }),
// }), deleteMovieById);
router.delete('/:movieId', deleteMovieById);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    // director: Joi.string().required().min(2).max(30),
    // duration: Joi.string().required().min(2).max(30),
    // year: Joi.string().required().min(2).max(30),
    // description: Joi.string().required().min(2).max(30),
    // image: Joi.string().required().min(2).max(30),
    // trailer: Joi.string().required().min(2).max(30),
    // thumbnail: Joi.string().required().min(2).max(30),
    // movieId: Joi.string().required().min(2).max(30),
    // nameRu: Joi.string().required().min(2).max(30),
    // nameEN: Joi.string().required().min(2).max(30),
  }),
}), createMovie);

module.exports = router;
