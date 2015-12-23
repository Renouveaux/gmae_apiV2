/**
* Login route, create Token if success, check Token et return Token info
*/
// Inclusion des dépendances
var jwt = require('jsonwebtoken')
, restify = require('restify')
, config = require('../config').get()
, ActiveDirectory = require('activedirectory')
, domain = config.ldap.domain
, ad = new ActiveDirectory(config.ldap);

module.exports = function (app, logger) {

	/**
	* User logs in using username
	* if new email is blank and email not validated, user cannot login
	*
	* @param request
	* @param response
	* @param next method
	*/
	function login(req, res, next) {

		if(typeof req.body.login == 'undefined' || typeof req.body.password == 'undefined'){
			return next(new restify.BadRequestError("Champs de connexion non saisie"));
		};

		Users.findOne({"pseudo": req.body.login.toLowerCase()})
		.populate('roles', 'name value')
		.populate('services')
		.exec(function(err, data) {
			if(data){
				var Token = jwt.sign({
					privilege: data.roles.value,
					role: data.roles.name,
					pseudo: data.name + ' ' + data.lastname,
					_id: data._id,
					service: data.services._id
				}, config.jwt_secret, {expiresIn: 30000});
				res.json({ data: data, token: Token });
			}else{
				return next(new restify.NotImplementedError("Désolé, Votre compte n'est pas correctement configuré"));
			}
		});


		/*ad.authenticate(req.body.login+'@'+domain, req.body.password, function(err, auth) {

			console.log(ad);

			if(err && err.name == 'InvalidCredentialsError'){
				return next(new restify.InvalidCredentialsError("Nom d'utilisateur ou mot de passe incorrect"));
			}else if(err){
				return next(new restify.InternalError(err.message));
			}

			if(auth){

				ad.isUserMemberOf(req.body.login, config.ldap.group, function(err, isMember) {
					if(err){
						var errObj = err;
						if (err.err) {
							errObj = err.err;
						}
						return next(new restify.InternalError(errObj));
					}

					if(isMember){
						Users.findOne({"pseudo": req.body.login.toLowerCase()})
						.populate('roles', 'name value')
						.populate('services')
						.exec(function(err, data) {
							if(data){
								var Token = jwt.sign({
									privilege: data.roles.value,
									role: data.roles.name,
									pseudo: data.name + ' ' + data.lastname,
									_id: data._id,
									service: data.services._id
								}, config.jwt_secret, {expiresInMinutes: 30000});
								res.json({ data: data, token: Token });
							}else{
								return next(new restify.NotImplementedError("Désolé, Votre compte n'est pas correctement configuré"));
							}
						});
					}else{
						return next(new restify.NotImplementedError("Désolé, aucun compte n'à été créer pour vous dans cette application"));
					}
				});
			}
		});*/
};

	/**
	* Post user credential. The function return a Token for the client
	*
	* @param login, pass
	* @param promised callback
	*/
	app.post(config.api_url + '/login', login);

};
