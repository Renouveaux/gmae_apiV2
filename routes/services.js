/**
* Service informations
*/
var config = require('../config').get();

module.exports = function (app, logger) {

	/**
	* Return the list of Services
	*
	* @param request params use as querystring for filter log
	* @param response send to client the object data
	* @param next method
	*/
	function getServices(req, res, next){

		
		Services.find(function(err, data){
			if(err){
				console.log(err);
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				Slipcovers.deepPopulate(data, 'slipcoverProperties, states', function (err, services) {

					if(req.user.privilege != 4){
						services = services.filter(function (el) {
							return el.name !== "Biomédical";
						});
					}

					services = services.filter(function (el) {
						return el.name !== "Gmae";
					});

					res.send(services);


				});
			}
		});

	};


	function getServicesById(req, res, next){
		Services.findById(req.params.id, function(err, service){
			if(err){
				console.log(err);
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				res.send(service);
			}
		});
	};

	/**
	* Search for log and filter
	*
	* @param limit, start, order
	* @param promised callback
	*/
	app.get(config.api_url + '/services', getServices);

	app.get(config.api_url + '/services/:id', getServicesById);

};