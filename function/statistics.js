
var mongoose = require('mongoose')
, states = require('./states')
, ObjectId = mongoose.Types.ObjectId
, restify = require('restify')
, Requests = mongoose.model('Request');


var _this = this;

var month = new Array();
month[0] = 0;
month[1] = 0;
month[2] = 0;
month[3] = 0;
month[4] = 0;
month[5] = 0;
month[6] = 0;
month[7] = 0;
month[8] = 0;
month[9] = 0;
month[10] = 0;
month[11] = 0;



var t = [
{
	name : "Total",
	data : month.slice()
},{
	name : "Hdpmb",
	data : month.slice()
},{
	name : "Location",
	data : month.slice()
}]


	/**
	 * Return all service except Biomédical and GMAE
	 * @param  {Function} cb Take a callback as param
	 * @return {callBack} 
	 */
	 function getServicesList(cb){

	 	Services.find(function(err, data){
	 		if(err){
	 			console.log(err);
	 			var errObj = err;
	 			if (err.err) { errObj = err.err; }
	 			return next(new restify.InternalError(errObj));
	 		}else{	

	 			data = data.filter(function (el) {
	 				return el.name !== "Biomédical";
	 			});

	 			data = data.filter(function (el) {
	 				return el.name !== "Gmae";
	 			});

	 			cb(err, data)
	 		}
	 	});
	 }



	/**
	 * Export the number of ask by month for a year
	 */
	 exports.getOneYear = function(req, res, next){

	 	var year = req.params.year;

	 	var C = JSON.parse( JSON.stringify( t ) );

	 	Request.find({
	 		"date": {'$gte': new Date(year+'-01-01T00:00:00.000Z'), '$lt': new Date(year+'-12-31T23:59:59.999Z')}
	 	}, function(err, d){

	 		d.forEach(function(data){

	 			var date = new Date(data.date);
	 			var n = date.getMonth();

	 			C[0].data[n]++;

	 			if(data.hire === undefined || data.hire === null){
	 				C[1].data[n]++;
	 			}else{
	 				C[2].data[n]++;
	 			}

	 		})

	 		res.send(C)

	 	})


	 }

	 exports.getRateYear = function(req, res, next){

	 	var year = req.params.year;

	 	Request.find({
	 		"date": {'$gte': new Date(year+'-01-01T00:00:00.000Z'), '$lt': new Date(year+'-12-31T23:59:59.999Z')},
	 		"hire" : {'$eq' : null}
	 	}, function(err, d){

	 		var r = d.map(function(obj){ 

	 			var day = Math.round((obj.dateEnd-obj.date)/(1000*60*60*24));

	 			//console.log(obj)
	 			var rObj = {};
	 			rObj['engines'] = obj.engines; 
	 			rObj['day'] = day;
	 			rObj['date'] = obj.date
	 			//return rObj;

	 			console.log(rObj)
	 		});

			res.send(r)

	 	}).populate('engines', 'label');




	 }