var cmdlineEnv = process.argv[2];

if (cmdlineEnv && cmdlineEnv.length > 0) {
	if (cmdlineEnv == '-d' || cmdlineEnv.toUpperCase() == '--DEVELOPMENT') {
		process.env.NODE_ENV = 'development';
	} else if (cmdlineEnv == '-p' || cmdlineEnv.toUpperCase() == '--PRODUCTION') {
		process.env.NODE_ENV = 'production';
	} else {
		console.log("Utilisation de l'application GMAE");
		return false;
	}
}

	// Chargement de la configuration
	var env = process.env.NODE_ENV || 'development'
	, config = require('./config').init(env);

	// Modules
	var restify = require("restify")
	, mongoose = require('mongoose')
	, jwt = require('restify-jwt');

	// Paths 
	var models_path = config.root + '/models';
	var route_path = config.root + '/routes';
	var utils_path = config.root + '/utils';

	//Utility
	require(utils_path + '/utility');

	// Logger
	var logger = require(utils_path + '/logger');
	logger.info("Lancement de l'application");

	// Database
	var connectStr = config.db_prefix +'://'+config.host+':'+config.db_port+'/'+config.db_database;
	mongoose.connect(connectStr, {server:{auto_reconnect:true}});
	var db = mongoose.connection;

	/**
	*
	* Listen the database status
	*
	*/
	mongoose.connection.on('opening', function() {
		logger.verbose("reconnecting... %d", mongoose.connection.readyState);
	});
	db.once('open', function callback () {
		logger.verbose("Database connection opened.");
	});
	db.on('error', function (err) {
		logger.debug("DB Connection error %s", err);
	});
	db.on('reconnected', function () {
		logger.verbose('MongoDB reconnected!');
	});
	db.on('disconnected', function() {
		logger.debug('MongoDB disconnected!');
		mongoose.connect(connectStr, {server:{auto_reconnect:true}});
	});

	// Bootstrap models
	require('./models');

	// Configure the server
	var app = restify.createServer({
		name: config.app.name,
		version: config.version
	});

	/**
	*
	* Allow cross domain communication
	*
	*/
	restify.CORS.ALLOW_HEADERS.push('authorization');

	app.use(restify.acceptParser(app.acceptable));
	app.use(restify.authorizationParser());
	app.use(restify.queryParser());
	app.use(restify.bodyParser());
	app.use(restify.CORS());
	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');
		if (req.method === 'OPTIONS') {
			res.send(200);
		}
		else {
			next();
		}
	});


	/**
	*
	* Json Web Token initialisation
	*
	*/
	app.use(jwt({ secret: config.jwt_secret, credentialsRequired: false}).unless({path: ['/api/v2/login', '/api/v2/ping', '/api/v2/logs']}));

	/**
	*
	* Intercept all error, principaly used for authentification
	*
	*/
	app.on('after', function (req, res, next, err) {
		if(err && err.restCode === 'InvalidCredentials') {
			logger.warn('Unauthorized access');
		} else {
			if(typeof err != 'undefined'){
				logger.debug(err);
			}
		}
	});

	/**
	*
	* Listener on error
	*
	*/
	app.on('error', function(err) {
		if(err.errno === 'EADDRINUSE') {
			logger.debug('Port already in use.');
			setTimeout(function(){process.exit(0);},1000);
		} else {
			logger.debug(err);
		}
	});

	/**
	*
	* Listener on uncaughtException
	*
	*/
	app.on('uncaughtException', function (req, res, route, err) {
		logger.debug(err.message, route.spec);
		res.send(err.code || 500, {
			code: err.code || 500,
			message: err.status || err.message || err.description || 'Internal Server Error'
		});
	});

/**
*
* Check if a session exist in the database et run the application
* The application doesn't start if database down
*
*/
var sessionKey;
Sessionkey.findOne({ key: /./ }, function (err, sessionKeyResult) {
	if (!err) {
		if (!sessionKeyResult) {
			// No key found, so create and store
			logger.verbose('Setting up a new session key.');
			sessionKey = new Sessionkey();
			sessionKey.key = (new mongoose.Types.ObjectId()).toString();
			sessionKey.save();
		} else {
			// use key founf in the database
			logger.verbose('Retrieved session key from db.');
			sessionKey = sessionKeyResult;
		}

		// because we can't have a synchronous DB call, finish up the server setup here
		require('./routes')(app, logger);

		// configure Socket Server
		var SocketHelper_IO = require(utils_path + '/socket-helper-socket-io.js').SocketHelper;
		socket = new SocketHelper_IO(app, logger);

		// Start the app by listening on <port>
		var port = process.env.PORT || config.port;

		app.listen(port);
		logger.verbose('App started on port ' + port);

	} else {
		logger.debug("Failed to start server due to database issue.");
		logger.debug(err);
	}
});
