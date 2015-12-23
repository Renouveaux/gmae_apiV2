var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	name: {type: String},
	description: {type: String},
	value: {type: Number}
});