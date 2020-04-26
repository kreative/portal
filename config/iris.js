const Iris = require("@kaynet/iris-node-sdk");

const SERVICE_KEY = process.env.SERVICE_KEY;
const AIDN = process.env.AIDN;

const IRIS = new Iris(AIDN, SERVICE_KEY);

module.exports = IRIS;