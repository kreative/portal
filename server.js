require('dotenv').config();

const path = require('path'); 
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const useragent = require("express-useragent");
const helmet = require("helmet");

const server = express();
const PORT = process.env.PORT || 3000;
const DB = require("./config/db").sequelize;

const accounts = require("./controllers/AccountsController");
const appchains = require("./controllers/AppchainsController");
const organizations = require("./controllers/OrganizationsController");
const serviceKeys = require("./controllers/ServiceKeyController");

const verifyKey = require("./utils/VerifyKeyMiddleware");
const getIPMiddleware = require("./utils/GetIPMiddleware");
const lookupIPInfoMiddleware = require("./utils/LookupIPInfoMiddleware");
const validateRedirectData = require("./utils/ValidateRedirectData");

server.use(helmet());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static(path.join(__dirname, '/public')));
server.use(useragent.express());
server.use(getIPMiddleware);
server.use(lookupIPInfoMiddleware);

server.engine('handlebars', exphbs({defaultLayout: 'main'}));
server.set('view engine', 'handlebars');

DB.authenticate()
.then(() => console.log('Portal DB is operational.'))
.catch(err => console.log({message: 'Connection to Portal DB failed', meta: err}));

server.get('/', (req, res) => res.render('home', {layout: 'homeLayout'}));
server.get('/404', (req, res) => res.render('404', {layout: 'homeLayout'}));
server.get('/login', validateRedirectData, accounts.getLoginPage);
server.get('/signup', validateRedirectData, accounts.getSignupPage);
server.get('/resetpassword', validateRedirectData, accounts.getResetPasswordPage);
server.get('/findusername', validateRedirectData, accounts.getFindUsernamePage);
server.post('/api/check', accounts.checkIfCredExists);
server.post('/api/convertemail', accounts.convertEmailToUsername);
server.post('/api/accounts/signup', accounts.signup);
server.post('/api/accounts/login', accounts.login);
server.post('/api/accounts/logout', verifyKey, accounts.logout);
server.post('/api/accounts/verify', accounts.verifyKey);
server.post('/api/accounts/resetcode', accounts.requestPasswordResetCode);
server.post('/api/accounts/resetcode/verify', accounts.verifyResetCode);
server.post('/api/accounts/resetpassword', accounts.resetPassword);
server.post('/api/appchains', verifyKey, appchains.createAppchain);
server.delete('/api/appchains', verifyKey, appchains.deleteAppchain);
server.post('/api/organizations', verifyKey, organizations.createOrganization);
server.post('/api/service_keys', verifyKey, serviceKeys.createServiceKey);
server.post('/api/service_keys/verify', serviceKeys.verifyServiceKey);
server.delete('/api/service_keys', verifyKey, serviceKeys.deleteServiceKey);

server.listen(PORT, console.log(`portal online::::${PORT}`));