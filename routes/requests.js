/**
* User Routes module
*    these routes require authenticated users
*/
var request = require('../function/requests')
, config = require('../config').get();


module.exports = function (app, logger) {

	/**
	* Get Request with filter
	*
	* @param.query exist={item1,item2,..} List when item exist in DB
	* @param.query nexist={item1,item2,..} List when item doesn't exist in DB
	* @param.query limit={number} limit number of result
	* @param.query state={number} value of the state	
	* @param promised callback
	*/
	app.get(config.api_url + '/request', request.getRequest);

	app.post(config.api_url + '/request', request.postRequest);

	app.put(config.api_url + '/request/:id', request.putRequest);

	app.del(config.api_url + '/request/:id', request.deleteRequest);


	// Creer une nouvelle requette et fait une demande à un fournisseur
	app.put(config.api_url + '/hire', request.putHire);

	// Modifie Hire en attribuant un numéro de prêt et le bon de libraison // $scope.saveDelivery
	app.put(config.api_url + '/hire/:id', request.putDelivery);


}