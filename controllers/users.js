const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotIncorrectDataError = require('../errors/not-incorrect-data-err');
const NotAuthError = require('../errors/not-auth-err');
const ConflictError = require('../errors/conflict-err');

const { TOKEN_KEY = 'super-strong-secret' } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, TOKEN_KEY, { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      if (err.name === 'Error') {
        next(new NotAuthError('Логин или пароль неверный!'));
      }
    });
};

const createUser = (req, res, next) => {
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      name: req.body.name,
      avatar: req.body.avatar,
      about: req.body.about,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send({
      data: {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('При регистрации указан email, который уже существует на сервере'));
      }
      if (err.name === 'ValidationError') {
        next(new NotIncorrectDataError('Переданы некорректные данные при создания пользователя'));
      }
    });
};

const opts = { new: true, runValidators: true };

const patchUser = (req, res, next) => {
  const data = { ...req.body };
  User.findByIdAndUpdate(req.user._id, { name: data.name, about: data.about }, opts)
    .orFail(new Error('Пользователь с указанным _id не найден.'))
    .then((userProfileInfo) => res.send(userProfileInfo))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotIncorrectDataError('Переданы некорректные данные при обновлении профиля.'));
        return;
      }
      if (err.message === 'Пользователь с указанным _id не найден.') {
        next(new NotFoundError(err.message));
        return;
      }
      next(err);
    });
};

const getUserProfileViaToken = (req, res, next) => {
  const { _id: userId } = req.user;

  User
    .findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  patchUser,
  login,
  createUser,
  getUserProfileViaToken,
};
