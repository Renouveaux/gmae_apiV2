/**
* User Routes module
*    these routes require authenticated users
*/
var config = require('../config').get();

module.exports = function (app, logger) {

	app.get(config.api_url + '/users', function(res, res, next){

		var users = Users.find();

		users.exec(function(err, data){
			if(err){
				var errObj = err;
				if (err.err) { errObj = err.err; }
				return next(new restify.InternalError(errObj));
			}else{
				res.send(data);
			}
		});


	});

}