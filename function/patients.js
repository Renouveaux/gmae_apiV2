
var mongoose = require('mongoose')
, Patients = mongoose.model('Patients')
, ObjectId = mongoose.Types.ObjectId
, restify = require('restify');


exports.getPatient = function(req, res, next) {

	var query = req.params;		

	var patient = Patients.find();

	patient.exec(function(err, data){

		if(err){
			var errObj = err;
			if (err.err) { errObj = err.err; }
			return next(new restify.InternalError(errObj));
		}else{
			res.send(data);
		};

	});

}

exports.addTransfer = function(req, res, next){
	var query = req.params;

	Patients.findByIdAndUpdate(query.id,
	{
		$push: {
			patientData: {
				$each: [{
					status: 'active',
					room: query.room,
					braden: query.braden,
					services: query.services,
					date: new Date
				}], $position: 0 
			}
		}
	}, function(err){
		if(err) {
			console.log(err);
			var errObj = err;
			if (err.err) { errObj = err.err; }
			return next(new restify.InternalError(errObj));
		}else{
			res.send(200);
		}
	});

}

var postPatients = function(data, cb){

	var patient = new Patients(data);

	patient.save(function(err, data) {
		if(err){
			var errObj = err;
			if (err.err) { errObj = err.err; }
			return next(errObj);
		}else{
			return cb(null, data._id);
		}
	});

}

exports.postPatients = postPatients;