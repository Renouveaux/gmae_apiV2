var config = require('../config').get();

module.exports = function (app) {

	/**
	*
	* Return stuff information about application
	*
	*/
	app.get(config.api_url, function (req, res) {
		res.send({
			app: {
				name: config.app.name,
				version: config.app.version
			},
			mailSettings : {
				from: config.mailSettings.from,
				smtp: {
					host: config.mailSettings.smtp.host,
					port: config.mailSettings.smtp.port,
					secure: config.mailSettings.smtp.secure,
					ignoreTLS : config.mailSettings.smtp.ignoreTLS
				}
			},
			file_directory: config.file_directory
		});
	});

	/**
	*
	* Return pong if application is running
	*/
	app.get(config.api_url + '/ping', function(req, res){
		res.send('pong !');
	});

}