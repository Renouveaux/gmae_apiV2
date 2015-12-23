/**
* Log route to controle app functionnality
*/
var config = require('../config').get();

module.exports = function (app, logger) {


	/**
	* Return the list of all logs. Possibility to filter it
	*
	* @param request params use as querystring for filter log
	* @param response send to client the object data
	* @param next method
	*/
	function getLogs(req, res, next){

		var options = {
			from: new Date - 24 * 60 * 60 * 1000,
			until: new Date,
			limit: req.params.limit || 99999,
			start: req.params.start || 0,
			order: req.params.order || 'desc'
		};
		logger.query(options, function (err, results) {
			if (err) {
				throw err;
			}
			res.send(results.file);
		});

	};

	/**
	* Search for log and filter
	*
	* @param limit, start, order
	* @param promised callback
	*/
	app.get(config.api_url + '/logs', getLogs);

};