var resource  = require('resource'),
    socket = resource.define('socket');

socket.schema.description = "websockets resource";

socket.method('start', start, {
  "description": "starts a websocket server",
  "properties": {
    "options": {
      "description": "Options to configure socket resource",
      "type": "object",
      "properties": {
        "engine": {
          "type": "string"
        },
        "server": {
          "type": "object"
        }
      }
    },
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

  //Uncomment the below and comment out the line below that if the engine resources that you want to test aren't published on npm yet.
  //resource[options.engine] = require('../' + options.engine + '/index.js')[options.engine];
  resource.use(options.engine || 'socketio');

  options.server = options.server || resource.http.server;

  return resource[options.engine].start(options.server, callback);
}

exports.socket = socket;
