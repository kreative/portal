const { RestClient } = require('@signalwire/node');

const SIGNALWIRE_URL = process.env.SIGNALWIRE_URL;
const SIGNALWIRE_PROJECT = process.env.SIGNALWIRE_PROJECT;
const SIGNALWIRE_TOKEN = process.env.SIGNALWIRE_TOKEN;

const sms = new RestClient(SIGNALWIRE_PROJECT, SIGNALWIRE_TOKEN, {signalwireSpaceUrl: SIGNALWIRE_URL});

module.exports = sms;