var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	name : {type: String},
	lastname: {type: String},
	pseudo: {type: String},
	roles: {type: mongoose.Schema.Types.ObjectId, ref: 'Roles'},
	services: {type: mongoose.Schema.Types.ObjectId, ref: 'Services', required : true},
	email: {type: String},
	phone: {type: String}
});