var engine = exports;

engine.createServer = function (resources, options, callback) {

  var io = require('socket.io').listen(options.server);
  callback(null, io);

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
          return engine.request(resource, action, payload, callback);
        }

        return callback(new Error(action + ' is not a valid action.'));
      });
    });
    socket.on('disconnect', function () { 
      // console.log('got a disconnect');
    });
  });
  return io;
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
