const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  deleteCardById,
  createMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCardById);

// router.post('/', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     link: Joi.string().required().custom((value, helpers) => {
//       if (!isURL(value, { require_protocol: true })) return helpers.error('Невалидная ссылка');
//       return value;
//     }),
//   }),
// }), createMovie);

router.post('/', createMovie);

module.exports = router;