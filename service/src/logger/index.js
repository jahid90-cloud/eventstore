const createLogger = ({ env }) => {
    return {
        debug: (log) => (env.isProduction ? () => {} : console.debug('[DEBUG]', log)),
        info: (log) => (env.isProduction ? () => {} : console.info('[INFO]', log)),
        warn: (log) => console.warn('[WARN]', log),
        error: (log) => console.error('[ERROR]', log),
    };
};

module.exports = createLogger;
