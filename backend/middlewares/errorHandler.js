module.exports = function errorHandler(err, req, res, next) {
  const { hostname, protocol, originalUrl, method, body, user, query } = req;
  const userId = user ? user.id : null;
  const requestDetails = { method, url: `${protocol}://${hostname}${originalUrl}`, body, query };
  let httpError;

  if (err.constructor.name === 'ResponseError' && err.title != null) {
    httpError = formatResponseError(err);
  } else if (err.statusCode != null && err.statusCode >= 400 && err.statusCode < 500) {
    httpError = new GenericBadRequest(err.message);
  } else if (!(err instanceof GenericError)) {
    apm.logError(err);
    httpError = new CodeException(err.message, err.stack, requestDetails, userId);
    logger.error({
      message: httpError.message,
      stack: err.stack,
      userId,
      requestDetails,
    });
  } else {
    httpError = err;
  }

  res.type('application/problem+json');
  const basicResponseBody = {
    type: httpError.type,
    title: httpError.title,
    detail: httpError.detail,
  };
  const responseBody = Object.assign(basicResponseBody, httpError.getTypeCustomFields());
  res.status(httpError.httpCode).json(responseBody);
};

function formatResponseError(err) {
  switch (err.type) {
    case 'bad-request-format':
      return new errors.BadRequestFormat(err.path, err.errors);
    case 'entity-conflict':
      return new errors.ConflictEntity(err.details, err.entity, err.params);
    case 'entity-not-found':
      return new errors.NotFoundEntity(err.details, err.entity, err.params);
    case 'access-forbiden':
      return new errors.Forbidden(err.details, err.username);
    case 'no-authorized-access':
      return new errors.UnAuthorized(err.details, err.code);
    default:
      return new errors.GenericError(err.title, err.detail, err.type, err.httpCode);
  }
}
