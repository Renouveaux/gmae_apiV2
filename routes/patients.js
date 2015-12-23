/**
* Patient Routes module
*    these routes require authenticated users
*/
var patient = require('../function/patients')
, config = require('../config').get();

module.exports = function (app) {
	
	/**
	* Get Request with filter
	*
	* @param.query exist={item1,item2,..} List when item exist in DB
	* @param.query nexist={item1,item2,..} List when item doesn't exist in DB
	* @param.query limit={number} limit number of result
	* @param.query state={number} value of the state	
	* @param promised callback
	*/
	app.get(config.api_url + '/patients', patient.getPatient);

	app.put(config.api_url + '/patients/transfer/:id', patient.addTransfer);

	
}