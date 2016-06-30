/**
* User Routes module
*    these routes require authenticated users
*/
var config = require('../config').get()
, mongoose = require('mongoose')
, Requests = mongoose.model('Request')
, Patients = mongoose.model('Patients')
, restify = require('restify')
, patient = require('../function/patients')
, states = require('../function/states');

module.exports = function (app, logger) {

	function createRequest(req, res, next){

		var body = req.body;

		var request = new Requests({
			users : body.request.users,
			mail: body.request.mail,
			date: body.request.date,
			dateEnd : body.request.dateEnd,
			engines : body.request.engines,
			slipcovers : body.request.slipcovers
		});

		request.pre('save', function(next){
			states.getFnStatesByValue("0", function(err, data){				
				request.states = data._id;
				next();
			});
		});

		request.pre('save', function(next){
			patient.postPatients({
				civility: body.patient.civility,
				name: body.patient.name,
				patientData: [{
					date: body.request.date,
					room: body.patient.patientData.room,
					braden: body.patient.patientData.braden,
					services: body.patient.patientData.services
				}]

			}, function(err, data){
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











	}

	app.post(config.api_url + '/newRequest', createRequest);

}