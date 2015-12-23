
var mongoose = require('mongoose')
, States = mongoose.model('States')
, ObjectId = mongoose.Types.ObjectId
, restify = require('restify');


	/**
	* Return the list of all States
	*
	* @param request params use as querystring for filter log
	* @param response send to client the object data
	* @param next method
	*/
	exports.getStatesList = function(req, res, next){

		States.find(function(err, states){

			if(req.params.search){
				res.send(states.filterByString(req.params.search));
			}else{
				res.send(states);
			}
			
		});

	};

	/**
	* Return a States by an ID
	*
	* @param request params use as querystring for filter log
	* @param response send to client the object data
	* @param next method
	*/
	exports.getStatesById = function(req, res, next){
		States.findById(req.params.id, function(err, states){
			if(err){
				console.log(err);
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				res.send(states);
			}
		});
	}

	/**
	* Return a States by his value
	*
	* @param request params use as querystring for filter log
	* @param response send to client the object data
	* @param next method
	*/

	exports.getStatesByValue = function(req, res, next){
		console.log("states search");
		getFnStatesByValue(5, function(err, data){
			res.send(data);
		});
	}

	var getFnStatesByValue = function(search, cb){

		if (search !== null && search !== '') {
			var query = States.where( 'value', search );
			query.findOne(function (err, data) {
				if (err) {
					var errObj = err;
					if (err.err) { errObj = err.err; }
					return cb(errObj);
				} else {
					return cb(null, data);
				}
			});
		}else {
			return cb(new restify.MissingParameterError('Searching Value required.'));
		};
		
	}

	exports.getFnStatesByValue = getFnStatesByValue;