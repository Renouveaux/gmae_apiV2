var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	date: {type: Date, default: Date.now},
	version: {type: String},
	changed: [{type: String}],
	fixed: [{type: String}],
	update: [{type: String}],
	users: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}]
});
