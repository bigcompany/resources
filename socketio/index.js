var resource  = require('resource'),
    socketio = resource.define('socketio');

socketio.schema.description = "socket.io resource";

socketio.method('start', start, {
  "description": "starts a websocket server",
  "properties": {
    "server": {
      "description": "The server that the socket should hook on to",
      "type": "object"
    },
    "callback": {
      "description": "the callback executed after server listen",
      "type": "function",
      "required": false
    }
  }
});

function start (server, callback){

  var io = require('socket.io').listen(server);

  socketio.io = io;

  callback(null, io);

  var resources = resource.resources;

  io.sockets.on('connection', function (socket) {
    Object.keys(resources).forEach(function(name) {
      var resource = resources[name];

      //
      // For every resource, create a new socket.io handler
      //
      //
      // Remark: Delegate the resource action to the appropiate engine method
      //
      socket.on(resource.name, function (action, payload, callback) {
        //
        // Resource methods
        //
        if(typeof resource[action] === 'function') {
          return request(resource, action, payload, callback);
        }

        return callback(new Error(action + ' is not a valid action.'));
      });
    });
    socket.on('disconnect', function () {
      // console.log('got a disconnect');
    });
  });
}

function request(resource, action, payload, callback) {
  if (!callback && typeof payload == 'function') {
    callback = payload;
    payload = null;
  }

  if (payload) {
    resource[action](payload, callback);
  }
  else {
    resource[action](callback);
  }
}

socketio.dependencies = {
  "socket.io": "*"
};

exports.socketio = socketio;
