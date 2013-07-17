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

function start (server, callback){
  var sockjsio = require('sockjs').createServer();
  sockjsio.installHandlers(server);

  callback(null, sockjsio);

  var resources = resource.resources;

  sockjsio.on('connection', function (socket) {
    Object.keys(resources).forEach(function(name) {
      var resource = resources[name];
      //
      // For every resource, create a new sock.js handler
      //
      //
      // Remark: Delegate the resource action to the appropiate engine method
      //
      socket.on('data', function(message){
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
    socket.on('disconnect', function () {
      // console.log('got a disconnect');
    });
  });
  return sockjsio;
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
