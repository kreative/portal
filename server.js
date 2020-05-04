const path = require('path');
const dotenv = require("dotenv"); 
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const useragent = require("express-useragent");
const helmet = require("helmet");
const Sentry = require("@sentry/node");

dotenv.config();

Sentry.init({dsn:process.env.SENTRY_DSN});

const server = express();
const IRIS = require("./config/iris");
const PORT = process.env.PORT || 3000;
const DB = require("./config/db").sequelize;

const accounts = require("./components/accounts/account.controller");
const appchains = require("./components/appchains/appchain.controller");
const organizations = require("./components/organizations/organization.controller");
const serviceKeys = require("./components/iam/ServiceKeyController");
const postage = require("./lib/postage/PostageController");
const permits = require("./components/permits/permit.controller");
const warrants = require("./components/warrants/warrant.controller");

const verifyKey = require("./middleware/VerifyKeyMiddleware");
const verifyServiceKey = require("./middleware/VerifyServiceKey");
const getIPMiddleware = require("./middleware/GetIP");
const lookupIPInfoMiddleware = require("./middleware/LookupIPInfo");
const validateRedirectData = require("./middleware/ValidateRedirectData");

server.use(Sentry.Handlers.requestHandler());
server.use(helmet());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static(path.join(__dirname, '/public')));
server.use(useragent.express());
server.use(getIPMiddleware);
server.use(lookupIPInfoMiddleware);

server.engine('handlebars', exphbs({defaultLayout: 'main'}));
server.set('view engine', 'handlebars');

server.get('/debug-sentry',(req, res) => {throw new Error('My first Sentry error!')});
server.get('/postage-test/:email', postage.emailTest);
server.get('/', (req, res) => res.render('home', {layout: 'homeLayout'}));
server.get('/404', (req, res) => res.render('404', {layout: '404Layout'}));

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
server.get('/api/permits/dev', verifyKey, permits.getPermitsForDev);
server.get('/api/permits/app', verifyKey, permits.getPermitsForDev);
server.post('/api/permits', verifyKey, permits.createPermit);
server.put('/api/permits', verifyKey, permits.updatePermit);
server.put('/api/permits/deactivate', verifyKey, permits.deactivatePermit);
server.delete('/api/permits', verifyKey, permits.deletePermit);
server.get('/api/warrants/account', verifyServiceKey, warrants.getWarrantsForAccount);
server.get('/api/warrants/app', verifyServiceKey, warrants.getWarrantsForApp);
server.post('/api/warrants', verifyServiceKey, warrants.createWarrant);
server.post('/api/warrants/check', verifyServiceKey, warrants.checkForWarrant);
server.put('/api/warrants/deactivate', verifyServiceKey, warrants.deactivateWarrant);

server.use(Sentry.Handlers.errorHandler());

DB.authenticate()
.then(() => server.listen(PORT, console.log(`portal online::::${PORT}`)))
.catch(err => IRIS.error("Portal DB failed to connect", err, ["database"]));