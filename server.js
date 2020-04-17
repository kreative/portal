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
.then(() => console.log('Portal DB is operational.'))
.catch(err => console.log({message: 'Connection to Portal DB failed', meta: err}));

// basic routes
server.get('/', (req, res) => res.render('home', {layout: 'homeLayout'}));

// accounts routes
server.get('/login', accounts.getLoginPage);
server.get('/signup', accounts.getSignupPage);
server.get('/passwordreset', accounts.getRequestResetPasswordPage);
server.get('/resetpassword', accounts.getResetPasswordPage);
server.get('/findusername', accounts.getFindUsernamePage);
server.get('/api/check/u/:username', accounts.checkIfUsernameExists);
server.get('/api/check/e/:email', accounts.checkIfEmailExists);
server.get('/api/check/p/:phone', accounts.checkIfPhoneExists);
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

server.listen(PORT, console.log("Portal is ready when you are."+PORT));