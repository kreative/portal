const Iris = require("@kaynet/iris-node-sdk");

const IRIS = new Iris(process.env.AIDN, "http://centrifuge.iris.kreativekws.com");

module.exports = IRIS;