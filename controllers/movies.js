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

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  Movie.findById(cardId).orFail(new Error('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        card.remove();
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

const createCard = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    // link: req.body.link,
    // owner: req.user._id, // используем req.user
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
  deleteCardById,
  createCard,
};
