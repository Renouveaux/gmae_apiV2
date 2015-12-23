var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	date: {type: Date, default: Date.now},
	room: {type: String},
	braden: {type: Number},
	services: {type: mongoose.Schema.Types.ObjectId, ref: 'Services'}
});