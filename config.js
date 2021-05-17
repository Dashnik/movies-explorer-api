require('dotenv').config();

const { PORT = 3000, TOKEN_KEY = 'super-strong-secret', MONGODB_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  TOKEN_KEY,
  MONGODB_URL,
  PORT,
};
