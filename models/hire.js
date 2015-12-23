var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	dateAsk: { type: Date, default: Date.now},
	dateIn: { type: Date},
	dateOut: {type: Date},
	dateEnd: {type: Date},
	cpage: {type: String},
	delivery: {type: String},
	loan: {type: String},
	rightReturn: {type: String}
});