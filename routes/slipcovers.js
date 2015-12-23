/**
* Manage manufacturers list
*/
var mongoose = require('mongoose')
, slipcovers = require('../function/slipcovers')
, config = require('../config').get();

module.exports = function (app) {




	/**
	* Get route for Slipcovers
	*
	* @param none
	* @param promised callback
	*/
	app.get(config.api_url + '/slipcovers', slipcovers.getSlipcover);

	/**
	* Get route for Slipcovers
	*
	* @param none
	* @param promised callback
	*/
	app.get(config.api_url + '/slipcovers/:id', slipcovers.getSlipcoverById);

	/**
	* Modifiy data by PUT method
	*
	* @param 
	*/
	app.put(config.api_url + '/slipcovers/:id', slipcovers.putSlipcoverById);

	/**
	* Create new Slipcovers
	*
	* @param 
	*/
	app.post(config.api_url + '/slipcovers', slipcovers.postSlipcover);

	/**	
	* Delete a Slipcovers
	* Need privilege up than admin
	*
	*/
	app.del(config.api_url + '/slipcovers/:id', slipcovers.deleteSlipcover);


	app.get(config.api_url + '/slipcovers/properties/:manufacturerId', slipcovers.getPropertiesByManufacturer);

};