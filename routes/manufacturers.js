/**
* Manage manufacturers list
*/
var config = require('../config').get();
var restify = require('restify');

module.exports = function (app, logger) {


	/**
	* Return the list of all Manufacturers
	*
	* @param not used
	* @param response send to client the object data
	* @param next method
	*/
	function getManufacturers(req, res, next){
		Manufacturers.find(function(err, manufacturers){
			if(err){
				console.log(err);
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				res.send(manufacturers);
			}
		});
	};

	function getManufacturerById(req, res, next){
		Manufacturers.findById(req.params.id, function(err, manufacturer){
			if(err){
				console.log(err);
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				res.send(manufacturer);
			}
		});
	};


	/**
	* Modify all informations needed for Manufacturer
	*
	* @param req.body for the content to modify
	* @param req.params.id who content the id of Manufacturer
	* @param next method
	*
	*/  
	function putManufacturerById(req, res, next){
		Manufacturers.findByIdAndUpdate(req.params.id, {
			$set: req.body
		}, function(err){
			if(err){
				console.log(err);
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				res.send(200);
			}
		});
	};

	/**
	*
	* Create a new Manufacturer
	*
	* @param req.body content all new Data
	*
	*/
	function postManufacturer(req, res, next){
		var manufacturer = new Manufacturers(req.body);

		manufacturer.save(function(err) {
			if(err){
				console.log(err);
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				res.send(201);
			}
		});
	};

	/**
	*
	* Delete a Manufacturer
	*
	* @param need auth level admin
	*
	*/
	function deleteManufacturer(req, res, next){
		if(req.user.privilege >= 4){

			Manufacturers.remove({_id: req.params.id}, function(err) {
				if(err){
					console.log(err);
					var errObj = err;
					if (err.err) { errObj = err.err; }
					return next(new restify.InternalError(errObj));
				}else{
					res.send(204);
				}
			});

		}else{
			return next(new restify.UnauthorizedError("Vous n'avez pas l'autorisation d'executer cette action."));
		};
	};


	/**
	* Get route for manufacturers
	*
	* @param none
	* @param promised callback
	*/
	app.get(config.api_url + '/manufacturers', getManufacturers);

	/**
	* Get route for manufacturers
	*
	* @param none
	* @param promised callback
	*/
	app.get(config.api_url + '/manufacturers/:id', getManufacturerById);

	/**
	* Modifiy data by PUT method
	*
	* @param 
	*/
	app.put(config.api_url + '/manufacturers/:id', putManufacturerById);

	/**
	* Create new Manufacturer
	*
	* @param 
	*/
	app.post(config.api_url + '/manufacturers', postManufacturer);

	/**	
	* Delete a Manufacturer
	* Need privilege up than admin
	*
	*/
	app.del(config.api_url + '/manufacturers/:id', deleteManufacturer);

};