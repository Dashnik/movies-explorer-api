const express = require('express');
const { errors } = require('celebrate');
const helmet = require('helmet');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./helpers/limiter');
const routes = require('./routes');
const MONGODB_URL = require('./config');

const app = express();
const errorHandler = require('./middlewares/error-handler.js');

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(helmet());
app.disable('x-powered-by');

// /** При получение данных используй эту функцию для обработки данных */
app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

// apply to all requests
app.use(limiter);

app.use(routes);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('App start');
});
