class CustomServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.name = 'Server Error';
  }
}
class BadRequestError extends CustomServerError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'Bad Request Error';
  }
}
class AuthenticationError extends CustomServerError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'Authentication Error';
  }
}
class AuthorizationError extends CustomServerError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'Forbidden';
  }
}
class NotFoundError extends CustomServerError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'Not Found';
  }
}
function errorHandler(err, req, res, next) {
  // TODO: Add logger
  console.error(err);
  if (err instanceof CustomServerError) {
    res.status(err.statusCode).json({ message: err.message, error: err });
  } else { // generic unknown err
    res.status(500).json({ message: err.message, error: err });
  }
}
module.exports = {
  errorHandler,
  CustomServerError,
  BadRequestError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError
}