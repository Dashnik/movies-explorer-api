const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-err');

const { TOKEN_KEY } = process.env;

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie;

  if (!authorization || !authorization.startsWith('jwt=')) {
    throw new NotAuthError('Необходима авторизация');
  }

  const token = authorization.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, TOKEN_KEY);
  } catch (err) {
    throw new NotAuthError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
