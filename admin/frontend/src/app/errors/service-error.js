function ServiceError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
    this.name = 'ServiceError';
}

ServiceError.prototype = Object.create(Error.prototype);
ServiceError.prototype.constructor = ServiceError;

module.exports = ServiceError;
