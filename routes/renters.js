/**
* Manage Renters list
*/
var renter = require('../function/renters')
, config = require('../config').get();

module.exports = function (app) {

	/**
	* Get route for Renter
	*
	* @param none
	* @param promised callback
	*/
	app.get(config.api_url + '/renters', renter.getRenters);

	/**
	* Get route for Renter
	*
	* @param none
	* @param promised callback
	*/
	app.get(config.api_url + '/renters/:id', renter.getRentersById);

	/**
	* Modifiy data by PUT method
	*
	* @param 
	*/
	app.put(config.api_url + '/renters/:id', renter.putRentersById);

	/**
	* Create new Renter
	*
	* @param 
	*/
	app.post(config.api_url + '/renters', renter.postRenters);

	/**	
	* Delete a Renter
	* Need privilege up than admin
	*
	*/
	app.del(config.api_url + '/renters/:id', renter.deleteRenters);

};