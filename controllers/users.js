const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const ConflictError = require('../errors/conflict-err');
const { TOKEN_KEY } = require('../config');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, TOKEN_KEY, { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
      // res.cookie('jwt', token, {
      //   // token - наш JWT токен, который мы отправляем
      //   maxAge: 3600000 * 24 * 7, // необходимо задеплоить этот код на ВМ
      //   sameSite: true,
      //   httpOnly: true,
      // })
      //   .end();
    })
    .catch((err) => {
      next(err);
    });
};

// const logout = (req, res) => {
//   res.clearCookie('jwt').end();
// };

const createUser = (req, res, next) => {
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      name: req.body.name,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('При регистрации указан email, который уже существует на сервере'));
      }
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при создания пользователя'));
      }
      next(err);
    });
};

const opts = { new: true, runValidators: true };

const patchUser = (req, res, next) => {
  const data = { ...req.body };

  User.findByIdAndUpdate(req.user._id, { name: data.name, email: data.email }, opts)
    .orFail(new Error('Пользователь с указанным _id не найден.'))
    .then((userProfileInfo) => res.send(userProfileInfo))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении профиля.'));
        return;
      }
      if (err.message === 'Пользователь с указанным _id не найден.') {
        next(new NotFoundError(err.message));
        return;
      }
      if (err.codeName === 'DuplicateKey') {
        next(new ConflictError('Почтовый адрес уже занят.'));
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
  // logout,
  createUser,
  getUserProfileViaToken,
};
