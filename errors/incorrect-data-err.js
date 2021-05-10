class IncorrectDataError extends Error {
  constructor(message = 'Неверные параметры в запросе') {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = IncorrectDataError;
