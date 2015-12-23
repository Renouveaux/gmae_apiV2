
var mongoose = require('mongoose')
, states = require('./states')
, ObjectId = mongoose.Types.ObjectId
, restify = require('restify');


	/**
	* Return all Engines and filter possibility
	*
	* @param request isn't used
	* @param response send to client the object data
	* @param next method
	*/
	exports.getEngine = function(req, res, next){

		var query = req.params;	

		var engines = Engines.find();

		/*
		* On filtre les elements existant
		*/
		if(typeof query.manufacturer !== 'undefined'){
			engines.populate('engineProperties', 'value', {manufacturers : { $in: [query.manufacturer] }});
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
			engines.populate('states', 'value', {value : { $in: filter }});
		};
		

		engines.exec(function(err, data){
			if(err){
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{

				Engines.deepPopulate(data, 'states, engineProperties.manufacturers', function (err, engine) {
					
					if(typeof query.state !== 'undefined'){
						engine = engine.filter(function(el){
							return el.states !== null;
						});
					}

					if(typeof query.manufacturer !== 'undefined'){
						engine = engine.filter(function(el){
							return el.engineProperties !== null;
						});
					};


					res.send(engine);

				});
			}
		});
	};


	/**
	* Same as previous but return only one engine, searching by Id or Serial number
	*
	* @param request containe just the search params
	* @param response send to client the object data
	* @param next method
	*/
	exports.getEngineByIdOrSerial = function(req, res, next) {

		var search = req.params.search;

		if (search !== null && search !== '') {
			var query = Engines.where( 'serial', new RegExp('^'+search+'$', 'i') );
			query.findOne(function (err, data) {
				if (!err) {
					if (data) {
						Engines.deepPopulate(data, 'states, engineProperties.manufacturers', function (err, engine) {
							res.send(engine);
						});
					} else {
						Engines.findById(search, function (err, data) {
							if (!err) {
								Engines.deepPopulate(data, 'states, engineProperties.manufacturers', function (err, engine) {
									res.send(engine);
								});
							} else {
								res.send(new restify.MissingParameterError('Engine not found.'));
							}
							return next();
						});
					}
				} else {
					var errObj = err;
					if (err.err) { errObj = err.err; }
					return next(new restify.InternalError(errObj));
				}
			});
		} else {
			return next(new restify.MissingParameterError('Serial or ID required.'));
		};
	};

	/**
	* Modify all informations needed for Engines
	*
	* @param req.body for the content to modify
	* @param req.params.id who content the id of Manufacturer
	* @param next method
	*
	*/  
	exports.putEnginesById = function(req, res, next){

		var query = req.body;
		
		if(typeof query.states !== 'undefined' && query.states.length <= '2'){
			states.getFnStatesByValue(query.states, function(err, data){	
				if(err){
					var errObj = err;
					if (err.err) { errObj = err.err; }
					return next(new restify.InternalError(errObj));
				}else{
					query.states = data._id;
					next(go());
				}		
			});
		}else{
			go();
		};

		function go(){
			Engines.findByIdAndUpdate(req.params.id, {
				$set: query
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
		}
	};

	/**
	* Return all active Engines and filter it by Manufacturer Id
	*
	* @param request isn't used
	* @param response send to client the object data
	* @param next method
	*/
	exports.getProperties = function(req, res, next){
		Engineproperties.find()
		.exec(function(err, d) {
			res.send(d);
		});
	};

	/**
	* Return all active Engines and filter it by Manufacturer Id
	*
	* @param request isn't used
	* @param response send to client the object data
	* @param next method
	*/
	exports.getPropertiesByManufacturer = function(req, res, next){
		Engineproperties.find({manufacturers: req.params.manufacturerId})
		.exec(function(err, d) {
			res.send(d);
		});
	};