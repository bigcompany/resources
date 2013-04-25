var sockets = exports;

exports.engines = {
  "socket.io": require('../lib/engines/socketio')
};

exports.createServer = function (resources, options, callback) {
  options = options || {};
  options.engine = options.engine || 'socket.io';
  return sockets.engines[options.engine].createServer(resources, options, callback);
};
