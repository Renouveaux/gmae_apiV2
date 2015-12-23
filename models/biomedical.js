var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var schema = module.exports = new mongoose.Schema({
	__v: {type: Number, select: false},
	date: {type: Date, default: Date.now},
	users : {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	request: {type: mongoose.Schema.Types.ObjectId, ref: 'Request'},
	message: {type: String},
	states: {type: mongoose.Schema.Types.ObjectId, ref: 'States'}
});

schema.plugin(deepPopulate);