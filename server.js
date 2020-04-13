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

const verifyKeyMiddleware = require("./utils/VerifyKeyMiddleware");
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

server.get('/', res.json(res.locals));

// accounts routes
server.get('/login', accounts.getLoginPage);
server.get('/signup', accounts.getSignupPage);
server.get('/passwordreset', accounts.getRequestResetPasswordPage);
server.get('/resetpassword', accounts.getResetPasswordPage);
server.post('/api/accounts/signup', accounts.signup);
server.post('/api/accounts/login', accounts.login);
server.post('/api/accounts/logout', verifyKeyMiddleware, accounts.logout);
server.post('/api/accounts/verify', accounts.verifyKey);
server.post('/api/accounts/resetcode', accounts.requestPasswordResetCode);
server.post('/api/accounts/resetcode/verify', accounts.verifyResetCode);
server.post('/api/accounts/resetpassword', accounts.resetPassword);

// appchains routes
server.post('/api/appchains',verifyKeyMiddleware, appchains.createAppchain);

// organizations routes
server.post('/api/organizations', verifyKeyMiddleware, organizations.createOrganization)

// postage routes
server.get('/api/postage/test/:email', postage.emailTest);

server.listen(PORT, '127.0.0.1', LOGGER.info("Portal is ready when you are."));