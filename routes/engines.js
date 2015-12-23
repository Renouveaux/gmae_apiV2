/**
* User Routes module
*    these routes require authenticated users
*/
var engines = require('../function/engines')
, config = require('../config').get();

module.exports = function (app, logger) {

	app.get(config.api_url + '/engines', engines.getEngine);

	app.get(config.api_url + '/engines/filter/:search', engines.getEngineByIdOrSerial);

	app.get(config.api_url + '/engines/properties/', engines.getProperties);

	app.get(config.api_url + '/engines/properties/:manufacturerId', engines.getPropertiesByManufacturer);

	app.put(config.api_url + '/engines/:id', engines.putEnginesById);

}