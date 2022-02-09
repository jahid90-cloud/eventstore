const createLogger = ({ env }) => {
    return {
        debug: (log) => (env.isProduction ? () => {} : console.debug(`${new Date().toISOString()} [DEBUG]`, log)),
        info: (log) => console.info(`${new Date().toISOString()} [INFO]`, log),
        warn: (log) => console.warn(`${new Date().toISOString()} [WARN]`, log),
        error: (log) => console.error(`${new Date().toISOString()} [ERROR]`, log),
    };
};

module.exports = createLogger;
