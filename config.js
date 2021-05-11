require('dotenv').config();

const { TOKEN_KEY = 'super-strong-secret', MONGODB_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  TOKEN_KEY,
  MONGODB_URL,
};
