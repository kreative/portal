const Iris = require("@kaynet/iris-node-sdk");

const SERVICE_KEY = process.env.PORTAL_TO_IRIS_SK;
const AIDN = process.env.AIDN;

const IRIS = new Iris(AIDN, SERVICE_KEY);

module.exports = IRIS;