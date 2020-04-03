require('dotenv').config();

const path = require('path'); 
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const useragent = require("express-useragent");
const helmet = require("helmet");

const server = express();
const PORT = process.env.SERVERPORT || 3000;
const DB = require("./config/db").sequelize;
const LOGGER = require("./config/logger");

const accounts = require("./controllers/AccountsController");
const appchains = require("./controllers/AppchainsController");
const organizations = require("./controllers/OrganizationsController");
const postage = require("./controllers/PostageController");

const verifyKey = require("./utils/VerifyKey");
const getIPMiddleware = require("./utils/GetIPMiddleware");
const lookupIPInfoMiddleware = require("./utils/LookupIPInfoMiddleware");

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
.then(() => LOGGER.info('Portal DB is operational.'))
.catch(err => LOGGER.error({message: 'Connection to Portal DB failed', meta: err}));

server.get('/', (req, res) => res.json(res.locals));

// accounts routes
server.get('/login', (req, res) => accounts.getLoginPage(req, res));
server.get('/signup', (req, res) => accounts.getSignupPage(req, res));
server.get('/passwordreset', (req, res) => accounts.getRequestResetPasswordPage(req, res));
server.get('/resetpassword', (req, res) => accounts.getResetPasswordPage(req, res));
server.post('/api/accounts/signup', (req, res) => accounts.signup(req, res));
server.post('/api/accounts/login', (req, res) => accounts.login(req, res));
server.post('/api/accounts/logout', verifyKey, (req, res) => accounts.logout(req, res));
server.post('/api/accounts/verify', verifyKey, (req, res) => accounts.verify(req, res));
server.post('/api/accounts/reset_token/username', (req, res) => accounts.requestPasswordResetUsername(req, res));
server.post('/api/accounts/reset_token/email', (req, res) => accounts.requestPasswordResetEmail(req, res));
server.post('/api/accounts/resetpassword', (req, res) => accounts.resetPassword(req, res));

// appchains routes
server.post('/api/appchains',verifyKey, (req, res) => appchains.createAppchain(req, res));

// organizations routes
server.post('/api/organizations', verifyKey, (req, res) => organizations.createOrganization(req, res))

// postage routes
server.get('/api/postage/test/:email', (req, res) => postage.emailTest(req, res));

server.listen(PORT, '127.0.0.1', LOGGER.info("Portal is ready when you are."));