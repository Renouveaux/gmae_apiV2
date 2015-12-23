/**
* Wrapper functionality for socket management
*/
var SocketIo = {}
, config = require('../config').get();

/**
 * Generates a SocketHelper
 *
 * https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
 *
 * @constructor
 * @param {Object} options
 */
 var SocketHelper = function(app, logger) {
 	this.initialize(app, config, logger);
 };

/**
 * Initializes properties
 *
 * @constructor
 * @param {Object} options
 */
 SocketHelper.prototype.initialize = function(app, appConfig, logger) {

  // This would allow Socket.IO to listen on the same port as the server
  SocketIo = require('socket.io').listen(app);
  logger.verbose("Socket.IO listening on port " + appConfig.port);

  SocketIo.on('connection', function(socket){
  	socket.emit('refresh');
  });

  SocketIo.sockets.on('connection', function(socket){

    // Socket venant du public
    socket.on('public:updateData', function(){
      SocketIo.sockets.emit('updateRequest');
    });

  	socket.on('public:transfert', function(){
      SocketIo.sockets.emit('updateEngine');
    });

    // Socket venant de l'admin
    socket.on('admin:processing', function(){
      SocketIo.sockets.emit('processing');
    });

    socket.on('refresh', function(){
      SocketIo.sockets.emit('refresh');
    });
  });



};

// Export SocketHelper constructor
module.exports.SocketHelper = SocketHelper;