var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	label: {type: String},
	slipcoverProperties: {type: mongoose.Schema.Types.ObjectId, ref: 'Slipcoverproperties'},
	states: {type: mongoose.Schema.Types.ObjectId, ref: 'States'}
});

schema.plugin(deepPopulate);