function NotFoundError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = 'NotFoundError';
    this.message = message;
    this.code = 404;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;
