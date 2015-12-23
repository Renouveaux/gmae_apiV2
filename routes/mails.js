var config = require('../config').get()
, mail = require('../function/mail');

module.exports = function (app, logger) {

	/********************************************************************
	
	Envoie un simple mail de test sur l'adresse par défaut dans la config
	
	********************************************************************/
	app.get(config.api_url + '/mail/test', mail.sendFakeMail);


};