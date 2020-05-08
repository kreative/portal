const axios = require("axios");

class Iris {

    constructor(aidn, irisUrl) {
        this.aidn = parseInt(aidn);
        this.url = irisUrl + "/log";
    }

    debug(message, meta, tags) {
        axios.post(this.url, {
            message,
            tags,
            meta,
            level: 'debug',
            aidn: this.aidn
        })
        .catch(error => {return error})
        .then(response => {return response});
    };

    info(message, meta, tags) {
        axios.post(this.url, {
            message,
            tags,
            meta,
            level: 'info',
            aidn: this.aidn
        })
        .catch(error => {return error})
        .then(response => {return response});
    };

    error(message, meta, tags) {
        axios.post(this.url, {
            message,
            tags,
            meta,
            level: 'error',
            aidn: this.aidn
        })
        .catch(error => {
            console.log(error);
            return error
        })
        .then(response => {return response});
    };

    warn(message, meta, tags) {
        axios.post(this.url, {
            message,
            tags,
            meta,
            level: 'warn',
            aidn: this.aidn
        })
        .catch(error => {return error})
        .then(response => {return response});
    };

    critical(message, meta, tags) {
        axios.post(this.url, {
            message,
            tags,
            meta,
            level: 'critical',
            aidn: this.aidn
        })
        .catch(error => {return error})
        .then(response => {return response});
    };
}

const AIDN = process.env.AIDN;

const IRIS = new Iris(AIDN, "https://iris.kreative.im");

module.exports = IRIS;