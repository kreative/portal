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

const postage = require("./lib/postage/PostageController");

const accountRoutes = require("./components/accounts/routes");
const appchainRoutes = require("./components/appchains/routes");
const organizationRoutes = require("./components/organizations/routes");
const permitRoutes = require("./components/permits/routes");
const warrantRoutes = require("./components/warrants/routes");
const aimRoutes = require("./components/aim/routes");

const getIPMiddleware = require("./middleware/GetIP");
const lookupIPInfoMiddleware = require("./middleware/LookupIPInfo");

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

server.use(accountRoutes);
server.use(appchainRoutes);
server.use(organizationRoutes);
server.use(permitRoutes);
server.use(warrantRoutes);
server.use(aimRoutes);

server.use(Sentry.Handlers.errorHandler());

DB.authenticate()
.then(() => server.listen(PORT, IRIS.info(`portal online::::${PORT}`,{},[])))
.catch(err => IRIS.error("Portal DB failed to connect", err, ["database"]));