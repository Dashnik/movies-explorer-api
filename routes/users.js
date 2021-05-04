const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  patchUser,
  getUserProfileViaToken,
} = require('../controllers/users');

router.get('/me', getUserProfileViaToken);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}),
patchUser);

module.exports = router;
