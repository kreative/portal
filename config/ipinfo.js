const IPinfo = require("node-ipinfo");

const IPINFO_ACCESS_TOKEN = process.env.IPINFO_ACCESS_TOKEN;

const ipinfo = new IPinfo(IPINFO_ACCESS_TOKEN); 

module.exports = ipinfo;