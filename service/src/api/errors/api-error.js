function ApiError(message, code) {
    Error.captureStackTrace(this, this.constructor);
    // this.name = 'ApiError';
    this.message = message;
    this.code = code;
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

module.exports = ApiError;
