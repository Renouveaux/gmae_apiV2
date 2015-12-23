/**
* Return all states information
*/
var states = require('../function/states')
, config = require('../config').get();

module.exports = function (app, logger) {

	/**
	* Search for log and filter
	*
	* @param limit, start, order
	* @param promised callback
	*/
	app.get(config.api_url + '/states', states.getStatesList);

	app.get(config.api_url + '/states/:id', states.getStatesById);

	app.get(config.api_url + '/states/filter/:search', states.getStatesByValue);


};