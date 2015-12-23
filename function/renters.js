
var mongoose = require('mongoose')
, ObjectId = mongoose.Types.ObjectId
, restify = require('restify');


	/**
	* Return the list of all Renters
	*
	* @param not used
	* @param response send to client the object data
	* @param next method
	*/
	exports.getRenters = function(req, res, next){
		Renters.find(function(err, manufacturers){
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

	exports.getRentersById = function(req, res, next){
		Renters.findById(req.params.id, function(err, manufacturer){
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
	* Modify all informations needed for Renters
	*
	* @param req.body for the content to modify
	* @param req.params.id who content the id of Renters
	* @param next method
	*
	*/  
	exports.putRentersById = function(req, res, next){
		Renters.findByIdAndUpdate(req.params.id, {
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
	* Create a new Renters
	*
	* @param req.body content all new Data
	*
	*/
	exports.postRenters = function(req, res, next){
		var renters = new Renters(req.body);

		renters.save(function(err) {
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
	* Delete a Renters
	*
	* @param need auth level admin
	*
	*/
	exports.deleteRenters = function(req, res, next){
		if(req.user.privilege >= 4){

			Renters.remove({_id: req.params.id}, function(err) {
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