var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
	__v: { type: Number, select: false},
	name: {type: String},
	address: {type: String},
	postcode: {type: String},
	city: {type: String},
	phone: {type: String},
	fax: {type: String},
	email: [{type: String, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']}]
});
