var resource  = require('resource'),
    socket = resource.define('socket');

socket.schema.description = "socket.io websocket resource";

socket.method('start', start, {
  "description": "starts a socket.io server",
  "properties": {
    "callback": {
      "description": "the callback executed after server listen",
      "type": "function",
      "required": false
    }
  }
});

function start (options, callback) {

  if (!callback && typeof options == 'function') {
    callback = options;
    options = {};
  }

  var socketful = require('./lib/socketful');
  socket.server = socketful.createServer(
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

exports.socket = socket;

exports.dependencies = {
  "socket.io": "0.9.x"
};
