/**
* User Routes module
*    these routes require authenticated users
*/
var stats = require('../function/statistics')
, config = require('../config').get();

module.exports = function (app, logger) {

	//app.get(config.api_url + '/statistics', stats.getStats);
	app.get(config.api_url + '/statistics/rate', stats.getRateYear);
	app.get(config.api_url + '/statistics/request', stats.getOneYear);

}