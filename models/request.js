var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

mongoose.plugin(require('mongoose-list'));


var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	date: { type: Date, default: Date.now },
	users: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	patients: {type: mongoose.Schema.Types.ObjectId, ref: 'Patients'},
	mail: {type: String},
	states: {type: mongoose.Schema.Types.ObjectId, ref: 'States', required: true},
	engines: {type: mongoose.Schema.Types.ObjectId, ref: 'Engines'},
	slipcovers: {type: mongoose.Schema.Types.ObjectId, ref: 'Slipcovers'},
	cpage: {type: String},
	renters: {type: mongoose.Schema.Types.ObjectId, ref: 'Renters'},
	hire: {type: mongoose.Schema.Types.ObjectId, ref: 'Hire'},
	dateEnd: { type: Date }, 
	canceled: { type: Boolean, default: false}
});

schema.plugin(deepPopulate);