const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const NotIncorrectDataError = require('../errors/not-incorrect-data-err');
const NotAccessErr = require('../errors/not-access-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(() => {
      next(new NotFoundError('Карточки не найдены'));
    });
};

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId).orFail(new Error('Карточка с указанным _id не найдена.'))
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        movie.remove();
        res.json({ message: 'Карточка была удалена.' });
      } else {
        throw new NotAccessErr('У вас нет прав на удаление чужих карточек.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotIncorrectDataError('Неправильно указана _id карточки.'));
        return;
      }
      if (err.message === 'Карточка с указанным _id не найдена.') {
        next(new NotFoundError(err.message));
        return;
      }
      next(err);
    });
};

const createMovie = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    // director: req.body.director,
    // duration: req.body.duration,
    // year: req.body.duration,
    // description: req.body.duration,
    // image: req.body.image,
    // trailer: req.body.trailer,
    // thumbnail: req.body.thumbnail,
    // movieId: req.body.movieId,
    // nameRu: req.body.nameRu,
    // nameEN: req.body.nameEN,
    owner: req.user._id, // используем req.user
  })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err._message === 'card validation failed') {
        next(new NotIncorrectDataError('Переданы некорректные данные при создании карточки.'));
      }
    });
};

module.exports = {
  getMovies,
  deleteMovieById,
  createMovie,
};
