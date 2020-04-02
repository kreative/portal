const log4js = require("log4js");

log4js.configure({
    appenders: {
        error: {   
            type: 'file',
            filename: "/logs/error.log",
            category: 'error',
            maxLogSize: 20480,
            backups: 10
        },
        info: {   
            type: "file",
            filename: "/logs/info.log",
            category: 'info',
            maxLogSize: 20480,
            backups: 10
        }
    },
    categories: {
        default: {
            appenders: ['info'],
            level: 'info'
        },
        error: {
            appenders: ['error'],
            level: 'error'
        },
        info: {
            appenders: ['info'],
            level: 'info'
        }
    }
});

const logger = log4js.getLogger();

module.exports = logger;