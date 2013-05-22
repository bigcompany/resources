var resource  = require('resource'),
    socket = resource.define('socket');

socket.schema.description = "websockets resource";

socket.method('start', start, {
  "description": "starts a websocket server",
  "properties": {
    "callback": {
      "description": "the callback executed after server listen",
      "type": "function",
      "required": false
    }
  }
});

//
// Available websocket engines
// see: /lib/engines/ for more
exports.engines = {
  "socket.io": require('./lib/engines/socketio')
};

function start (options, callback) {

  if (!callback && typeof options == 'function') {
    callback = options;
    options = {};
  }

  var sockets = require('./lib/sockets');
  socket.server = sockets.createServer(
    resource.resources,
    { server: resource.http.server },
    function (err, io) {
      if (err) {
        return callback(err);
      }
      socket.io = io;
      callback(err, io);
    }
  );
}

socket.dependencies = {
  "socket.io": "0.9.x"
};

exports.socket = socket;