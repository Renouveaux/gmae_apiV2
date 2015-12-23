var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	date: {type: Date, default: Date.now},
	subject: {type: String},
	message: {type: String},
	users: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	responses: [{
		message: {type: String},
		users: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
		date: {type: Date}
	}],
	states: {type: mongoose.Schema.Types.ObjectId, ref: 'States'},
});

schema.plugin(deepPopulate);