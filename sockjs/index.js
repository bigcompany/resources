var resource  = require('resource'),
    sockjs = resource.define('sockjs');

sockjs.schema.description = "sock.js resource";

sockjs.method('start', start, {
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

sockjs.method('send', send, {
  "description": "sends a message to all open connections",
  "properties": {
    "message": {
      "required": true
    }
  }
});

function start (server, callback){
  var socketServer = require('sockjs').createServer();
  socketServer.installHandlers(server);

  //
  // Attach socketServer to sockjs
  //
  sockjs.socketServer = socketServer;

  //
  // Namespace for caching sockets
  //
  sockjs.connections = {};

  callback(null, socketServer);

  var resources = resource.resources;

  socketServer.on('connection', function (connection) {
    //
    // Attach connected socket to sockets namespace (Modelled after socket.io)
    //
    sockjs.connections[connection.id] = connection;

    Object.keys(resources).forEach(function(name) {
      var resource = resources[name];
      //
      // For every resource, create a new sock.js handler
      //
      connection.on('data', function(message){
        //
        // Since SockJs just sends plain strings. we need to parse JSON to conform with the socket resource interface
        //
        try {
          message = JSON.parse(message);
        } catch (er) {
          return callback(new Error(message + ' is not valid JSON'));
        }

        //
        // Ignore Resources that aren't defined
        //
        if(resource.name !== message[0]) return ;

        //
        // Resource methods
        //
        if(typeof resource[message[1]] === 'function') {
          return request(resource, message[1], message[2], message[3]);
        }

        return callback(new Error(message[1] + ' is not a valid action.'));
      });
    });

    connection.on('disconnect', function (connection) { 
      //
      // Remove socket from cache
      //
      delete sockjs.connections[connection.id];
    });
  });
  return socketServer;
}

function send(message, callback){
  if(!sockjs.socketServer) 
    return callback(new Error('sockjs.socketServer must be initialized before sending messages'));
  else if(Object.keys(sockjs.connections).length < 1) 
    return callback(new Error('There are no connected connections to send messages to'));

  var connections = sockjs.connections;

  for (var key in connections){
    connections[key].write(message);
  }

  if(callback) callback(null, this);
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

sockjs.dependencies = {
  "sockjs": "*"
};

exports.sockjs = sockjs;
