const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const NotAuthError = require('../errors/not-auth-err');

// Опишем схему:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Поле "name" должно быть заполнено'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v),
      message: 'Введен невалидный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

/** добавим метод findUserByCredentials схеме пользователя
 у него будет два параметра — почта и пароль  */
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        return Promise.reject(new NotAuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthError('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
