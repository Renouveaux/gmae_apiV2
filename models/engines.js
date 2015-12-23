var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	name: {type: String},
	serial: {type: String},
	inventory: {type: String},
	label: {type: String},
	engineProperties: {type: mongoose.Schema.Types.ObjectId, ref: 'Engineproperties'},
	states: {type: mongoose.Schema.Types.ObjectId, ref: 'States'}
});

schema.plugin(deepPopulate);