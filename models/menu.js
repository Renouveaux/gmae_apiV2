var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	position: {type: Number},
	display_name: {type: String},
	controller: {type: String},
	class: {type: String},
	privilege: {type: String},
	url: {type: String}
});