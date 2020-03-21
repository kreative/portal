const generate = require('nanoid/generate');
const Keychain = require("../models/Keychain");
const jwt = require("jsonwebtoken");

const SECRET = process.env.KEYCHAIN_SECURITY_CODE;

exports.generateKey = (ksn, aidn) => {
    const time = Date.now();
    const secureHash = generate("1234567890", 12);
    const key = jwt.sign({ksn, aidn, secureHash, time}, SECRET);

     //eventually this callback needs to do the following:
    //add the token emblem to the Emblem Database (with the token, and when it expires)
    //// you need to save the token, exp timestamp, and the SECURE SECRET
    //// eventually, the secret in the database will be used to verify to JWT
    /////// this way each token has a different secret
    //log that a token was made through segment
        
    return new Promise((resolve, reject) => {
        resolve(token);
    });

};