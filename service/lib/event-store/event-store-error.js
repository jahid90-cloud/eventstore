function EventStoreError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
    this.name = 'EventStoreError';
}

EventStoreError.prototype = Object.create(Error.prototype);
EventStoreError.prototype.constructor = EventStoreError;

module.exports = EventStoreError;
