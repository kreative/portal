require("winston-mongodb");
const {
    createLogger,
    transports
} = require("winston");

const MONGODB_URL = process.env.MONGODB_URL;

const logger = createLogger({
    transports: [
        new transports.MongoDB({
            level: 'error',
            db: MONGODB_URL,
            collection: 'logs',
            options: {
                useUnifiedTopology: true
            }
        }),
        new transports.MongoDB({
            level: 'info',
            db: MONGODB_URL,
            collection: 'logs',
            options: {
                useUnifiedTopology: true
            }
        }),
        new transports.MongoDB({
            level: 'debug',
            db: MONGODB_URL,
            collection: 'logs',
            options: {
                useUnifiedTopology: true
            }
        }),
        new transports.MongoDB({
            level: 'emerg',
            db: MONGODB_URL,
            collection: 'logs',
            options: {
                useUnifiedTopology: true
            }
        }),
    ]
});

module.exports = logger;