const express = require('express');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const router = require('express').Router();
const mongoose = require('mongoose');
const cors = require('cors');

const { login, createUser, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./helpers/limiter');

const app = express();
const { MONGODB_URL } = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(helmet());
app.disable('x-powered-by');

/** При получение данных используй эту функцию для обработки данных */
app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

// apply to all requests
app.use(limiter);

// роуты, не требующие авторизации,
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signout',
  logout,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

app.use(router);
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log('App start');
});
