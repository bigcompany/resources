var engine = exports;

engine.createServer = function (resources, options, callback) {

  var sockjs = require('sockjs').createServer()
  sockjs.installHandlers(options.server);

  callback(null, sockjs);

  sockjs.on('connection', function (socket) {
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
          return engine.request(resource, message[1], message[2], message[3]);
        }

        return callback(new Error(message[1] + ' is not a valid action.'));
      });
    });
    socket.on('disconnect', function () { 
      // console.log('got a disconnect');
    });
  });
  return sockjs;
};

engine.request = function(resource, action, payload, callback) {
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

