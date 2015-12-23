var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	model: {type: String},
	reference: {type: String},
	description: {type: String},
	manufacturers: {type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturers'}
});