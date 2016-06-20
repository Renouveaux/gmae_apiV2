/**
* User Routes module
*    these routes require authenticated users
*/
var mongoose = require('mongoose')
, config = require('../config').get()
, Requests = mongoose.model('Request')
, Hire = mongoose.model('Hire')
, Patients = mongoose.model('Patients')
, states = require('./states')
, mail = require('./mail')
, Engines = mongoose.model('Engines')
, Slipcovers = mongoose.model('Slipcovers')
, patient = require('./patients')
, ObjectId = mongoose.Types.ObjectId
, restify = require('restify')
, fs = require('fs');


	/**
	* Gateway request routes to other functions based on params
	* Search for a user by id or username
	* if none given get the logged in user's information
	*
	* @param request can include an id, a username or no search param
	* @param response contains a populated User object
	* @param next method
	*/
	exports.getRequest = function(req, res, next) {

		var query = req.params;		

		var request = Requests.find();

		/*
		* On filtre les elements existant
		*/
		if(typeof query.exist !== 'undefined'){
			var obj = query.exist.split(',');

			for (var i=0; i<obj.length; i++) {
				request.exists(obj[i]);
			}
		};

		/*
		* On filtre les elements n'existant pas
		*/
		if(typeof query.nexist !== 'undefined'){
			var obj = query.nexist.split(',');

			for (var i=0; i<obj.length; i++) {
				request.exists(obj[i], false);
			}
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
			request.populate('states', 'value', {value : { $in: filter }});
		};

		
		request.exec(function(err, data){

			if(err){
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				Request.deepPopulate(data, 'users.services, patients.patientData.services, states, engines.engineProperties, hire, renters, slipcovers', function (err, _posts) {
					
					/*
					* Corrige le problème de mongoose, supprime les states à null (suite au populate précédent)
					*/
					_posts = _posts.filter(function(el){
						return el.states !== null;
					});

					if(typeof query.filter !== 'undefined'){
						_posts = _posts.filter(function(el){
							return el.engines.engineProperties.model.toLowerCase() == query.filter.toLowerCase();
						});
					};

					/*
					* Toujours due au populate on fait le limit à la main
					*/
					if(typeof query.limit !== 'undefined'){
						_posts = _posts.slice(0, query.limit);
					};

					if(typeof query.service !== 'undefined'){
						_posts = _posts.filter(function(el){
							return el.patients.patientData[0].services._id == query.service
						});
					}

					res.send(_posts);
				});
			};
		});
	};


	// Créer une nouvelle requete (demande)
	exports.postRequest = function(req, res, next){

		var request = new Requests(
		{
			users : req.user._id,
			mail: req.body.mail
		});

		request.pre('save', function(next){
			states.getFnStatesByValue("7", function(err, data){				
				request.states = data._id;
				next();
			});
		});

		request.pre('save', function(next){
			patient.postPatients(req.body, function(err, data){
				if(err){
					var errObj = err;
					if (err.err) { errObj = err.err; }
					return next(new restify.InternalError(errObj));
				}else{
					request.patients = data;
					next();	
				}				
			});
		});

		request.save(function(err, data){
			if(err){
				var errObj = err;
				if (err.err) { errObj = err.err; }
				Patients.remove({_id: patient.id}, function(err, data){});
				return next(new restify.InternalError(errObj));
			}else{
				res.send(201);
			}
		});

	};

	// Creer une nouvelle requette et fait une demande à un fournisseur
	exports.putHire = function(req, res, next){

		var formData = JSON.parse(req.body.data);

		var mailData = {
			from: config.mailSettings.defaultFromAddress,
			to: formData.renter.email,
			cc: formData.mail,
			template: 'hire',
			attachments: [{
				filename: formData.cpage + '.' + req.files.file.name.split('.').pop(),
				content: fs.createReadStream(req.files.file.path)
			}],
			context: {
				cpage: formData.cpage,
				civility: formData.patient.civility,
				patientName: formData.patient.name,
				serviceName: formData.patient.patientData[0].services.name,
				message: formData.message_renter
			}
		};

		var hire = new Hire({
			cpage: formData.cpage
		});

		hire.pre('save', function(next){
			states.getFnStatesByValue('13', function(err, data){	
				formData.states = data._id;
				next();
			});
		});

		hire.pre('save', function(next){		
			Request.findByIdAndUpdate(formData.request,
			{
				$set: {
					hire: hire._id,
					renters: formData.renter._id,
					states: formData.states
				}
			}, function(err){
				if(err){
					res.status(400).send("Une erreur est survenue");
				}else{
					next();
				}
			});

		});

		hire.save(function(err, data){
			if(err){
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				next(sendMail());
			}
		});


		function sendMail(){
			mail.sendMail(mailData, 'Nouvelle demande de location', function(err, data){
				if(err){
					var errObj = err;
					if (err.err) { errObj = err.err; }
					return next(new restify.InternalError(errObj));
				}else{
					res.json(data);
				}
			});
		}
	}

	// TODO
	// Sortir les appels direct à Engines et Slipcover pour appel des fn de routage
	exports.putRequest = function(req, res, next){

		var query = req.params;	
		var obj = query.value;

		if(typeof query.state !== "undefined"){
			states.getFnStatesByValue(query.state, function(err, data){	
				if(typeof obj == 'undefined'){	
					obj = { states : data._id };
					next(updateRequest());
				}else{	
					obj.states = data._id;
					next(updateEngine());
				}
			});
		}else{
			obj = query;
			next(updateRequest());
		}

		function updateEngine(){
			Engines.findByIdAndUpdate(query.value.engines, {
				$set: {
					states: obj.states
				}
			}, function(err){
				if(err){
					res.send(400, "Une erreur est survenue");
				}else{
					next(updateSlipcover());
				}
			});

		}

		function updateSlipcover(){
			Slipcovers.findByIdAndUpdate(query.value.slipcovers, {
				$set: {
					states: obj.states
				}
			}, function(err){
				if(err){
					res.send(400, "Une erreur est survenue");
				}else{
					next(updateRequest());
				}
			});
		}

		function updateRequest(){
			Requests.findByIdAndUpdate(query.id,{
				$currentDate: {
					lastModified: true,
					"lastModified": { $type: "date" }
				},
				$set: obj,
				dateEnd: Date.now()
			}, function(err){
				if(err){
					res.send(400);
				}else{
					res.send(200);
				}
			});
		}

	}


	exports.putEnginesById = function(req, res, next){
		Engines.findByIdAndUpdate(req.params.id, {
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


	exports.putDelivery = function(req, res, next){

		var params = req.params;
		var obj = params.value;

		var information = params.information;

		if(params.mail === 'true'){
			var date = new Date(information.hire.dateAsk);
			date = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();

			var mailData = {
				from: config.mailSettings.defaultFromAddress,
				to: information.renters.email,
				cc: information.mail,
				template: params.template,
				context: {
					loan: information.hire.loan,
					date: date,
					cpage: information.hire.cpage,
					civility: information.patients.civility,
					patientName: information.patients.name,
					serviceName: information.patients.patientData[0].services.name
				}
			}

			mail.sendMail(mailData, params.subject, function(err, data){
				if(err){
					var errObj = err;
					if (err.err) { errObj = err.err; }
					return next(new restify.InternalError(errObj));
				}
			});
		}

		Hire.findByIdAndUpdate(params.id, {
			$set: obj
		}, function(err){
			if(err){
				res.status(400).send("Une erreur est survenue");
			}else{
				states.getFnStatesByValue(params.state, function(err, data){					
					next(updateRequest(data._id));			
				});
			}
		});

		function updateRequest(state){
			Requests.findByIdAndUpdate(params.request,{
				$set: {
					states: state
				}
			}, function(err){
				if(err){
					res.send(400, "Une erreur est survenue");
				}else{
					res.send(200);
				}
			});
		}
	};

	exports.deleteRequest = function(req, res, next){

		var request = Request.findById(req.params.id);

		request.exec(function(err, data){
			Request.deepPopulate(data, 'states', function (err, _posts) {

				if(_posts.states.value !== 7 && _posts.states.value !== 15 && req.user.privilege != 4){
					return next(new restify.MethodNotAllowedError("Vous ne pouvez supprimer cette resource"));
				}else{

					Patients.remove({ _id: _posts.patients }, function(err) {
						if (err) {
							var errObj = err;
							if (err.err) { errObj = err.err; }
							return next(new restify.BadRequestError(errObj));
						}else{
							request.remove(function(err){
								if (err) {
									var errObj = err;
									if (err.err) { errObj = err.err; }
									return next(new restify.BadRequestError(errObj));
								}else{
									res.send(200);
								}
							});
						}
					});

				}

			});

		});


	};
