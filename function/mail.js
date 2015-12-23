var nodemailer = require('nodemailer')
, config = require('../config').get()
, path = require('path')
, smtpPool = require('nodemailer-smtp-pool')
, nodePaperboy = require('node-paperboy')
, restify = require('restify')
, fs = require('fs');

exports.sendFakeMail = function(req, res, next){

	var data = {
		from: 'test@serveur.lan',
		to: config.mailSettings.defaultFromAddress,
		template: 'test'
	}

	sendMail(data, 'Message de test', function(err, result){
		if(err){
			var errObj = err;
			if (err.err) { errObj = err.err; }
			return next(new restify.InternalError(errObj));
		}else{
			res.json(result);
		}
	});

}


var sendMail = function(options, subject, cb){

	transport = nodemailer.createTransport(smtpPool(config.mailSettings.smtp));

	transport.use('compile', nodePaperboy({
		viewPath: path.join(__dirname, "../templates"),
		cidFolder: 'img'
	}));

	transport.sendMail({
		from: options.from,
		to: options.to,
		subject: subject,
		template: options.template,
		attachments: options.attachments,
		context: options.context
	}, function(err, data){
		if(err){
			var errObj = err;
			if (err.err) { errObj = err.err; }
			return cb(errObj);
		}else{
			return cb(null, data);
		}
	});

}

exports.sendMail = sendMail;
