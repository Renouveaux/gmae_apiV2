/**
* Routing menu
*/
var config = require('../config').get();

module.exports = function (app, logger) {


	/**
	* Return the menu data
	*
	* @param request params use as querystring for filter log
	* @param response send to client the object data
	* @param next method
	*/
	function getMenu(req, res, next){

		Menu.find(function(err, result){
			res.send(result);
		});

	};

	function postMenu(req, res, next){
		var menu = new Menu(req.body);

		menu.save(function(err) {
			if(err){
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				res.send(201);
			}
		});
	};

	/**
	* Return the Menu Object
	*
	* @param none
	* @param promised callback
	*/
	app.get(config.api_url + '/menu', getMenu);

	/**
	* Add an entry point
	*
	* @param data Object
	* @param promised callback
	*/
	app.post(config.api_url + '/menu', postMenu);

};