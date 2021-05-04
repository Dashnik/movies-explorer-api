const mongoose = require('mongoose');
const { isURL } = require('validator');

// Опишем схему:
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
  //  required: true,
  },
  director: {
    type: String,
  //  required: true,
  },
  duration: {
    type: Number,
   //  required: true,
  },
  year: {
    type: String,
  //  required: true,
  },
  description: {
    type: String,
  //  required: true,
  },
  image: {
    type: String,
    //  required: true,
    validate: {
      validator(value) {
        return isURL(value);
      },
      message: (props) => `${props.value} не является совместимой ссылкой!`,
    },
  },
  trailer: {
    type: String,
    //  required: true,
    validate: {
      validator(value) {
        return isURL(value);
      },
      message: (props) => `${props.value} не является совместимой ссылкой!`,
    },
  },
  thumbnail: {
    type: String,
    //  required: true,
    validate: {
      validator(value) {
        return isURL(value);
      },
      message: (props) => `${props.value} не является совместимой ссылкой!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
  //  required: true,
  },
  nameRu: {
    type: String,
   //  required: true,
  },
  nameEN: {
    type: String,
     //  required: true,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
