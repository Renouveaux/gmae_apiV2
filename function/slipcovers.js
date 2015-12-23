
var mongoose = require('mongoose')
, States = mongoose.model('States')
, ObjectId = mongoose.Types.ObjectId
, restify = require('restify');


	/**
	* Return the list of all Slipcovers
	*
	* @param not used
	* @param response send to client the object data
	* @param next method
	*/
	exports.getSlipcover = function(req, res, next){

		var query = req.params;

		var slipcovers = Slipcovers.find();

		/*
		* On filtre les elements existant
		*/
		if(typeof query.manufacturer !== 'undefined'){
			slipcovers.populate('slipcoverProperties', 'value', {manufacturers : { $in: [query.manufacturer] }});
		};

		/*
		* On populate le state avec un filtre en surplus
		*/
		if(typeof query.state !== 'undefined'){
			var obj = query.state.split(',');
			var filter = [];

			for (var i=0; i<obj.length; i++) {
				filter.push(obj[i]);
			}		
			slipcovers.populate('states', 'value', {value : { $in: filter }});
		};

		slipcovers.exec(function(err, data){
			if(err){
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{

				Slipcovers.deepPopulate(data, 'slipcoverProperties, states', function (err, slipcover) {
					
					if(typeof query.state !== 'undefined'){
						slipcover = slipcover.filter(function(el){
							return el.states !== null;
						});
					}

					if(typeof query.manufacturer !== 'undefined'){
						slipcover = slipcover.filter(function(el){
							return el.slipcoverProperties !== null;
						});
					};

					res.send(slipcover);
				});


			}
		});
	};

	exports.getSlipcoverById = function(req, res, next){
		Slipcovers.findById(req.params.id, function(err, slipcover){
			if(err){
				console.log(err);
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				res.send(slipcover);
			}
		});
	};


	/**
	* Modify all informations needed for Slipcovers
	*
	* @param req.body for the content to modify
	* @param req.params.id who content the id of Manufacturer
	* @param next method
	*
	*/  
	exports.putSlipcoverById = function(req, res, next){
		Slipcovers.findByIdAndUpdate(req.params.id, {
			$set: req.body
		}, function(err){
			if(err){
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
	* Create a new Slipcovers
	*
	* @param req.body content all new Data
	*
	*/
	exports.postSlipcover = function(req, res, next){
		var slipcover = new Slipcovers(req.body);

		slipcover.save(function(err) {
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
	* Delete a Slipcovers
	*
	* @param need auth level admin
	*
	*/
	exports.deleteSlipcover = function(req, res, next){
		if(req.user.privilege >= 4){

			Slipcovers.remove({_id: req.params.id}, function(err) {
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
	* Return slipcover properties by Manufacturer ID
	*
	* @param request isn't used
	* @param response send to client the object data
	* @param next method
	*/
	exports.getPropertiesByManufacturer = function(req, res, next){
		Slipcoverproperties.find({manufacturers: req.params.manufacturerId})
		.exec(function(err, d) {
			res.send(d);
		});
	};