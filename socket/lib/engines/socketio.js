var engine = exports;

engine.createServer = function (resources, options, callback) {
  var io = require('socket.io').listen(options.server || 8000, function(){
    if (callback) {
      callback(null, io);
    }
  });
  io.sockets.on('connection', function (socket) {
    resources.forEach(function(resource) {
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
  //
  // Remark: Perform a switch/case to determine Resource method call signature
  //
  switch (action) {
    case 'create':
      resource[action](payload, function(err, result){
        callback(err, result);
      });
    break;
    case 'get':
      resource[action](payload, callback);
    break;
    case 'all':
      resource[action](callback);
    break;
    case 'update':
      resource[action](payload.id, payload, callback);
    break;
    case 'destroy':
      resource[action](payload.id, callback);
    break;
    default:
      //
      // Remark: an abritrary remote method, intended to be exposed
      //
      if(resource[action].remote === true) {
        resource[action](payload.id, payload, callback);
      } else {
        //
        // Remark: Determine if it's any child methods
        //
        var _action = action.substr(0, 3);
        switch (_action) {
          case 'get':
            //
            //  getChild
            //
            resource.get(payload.album_id, function(err, child){
              if(err) {
                return callback(err);
              }
              child[action](payload, callback);
            });

            resource[action](payload, callback);
          break;
          case 'cre':
            //
            //  createChild
            //

            //
            // Remark: must get instance of parent before creating child
            //
            // see: https://github.com/flatiron/resourceful/issues/110
            //
            resource.get(payload.album_id, function(err, child){
              if(err) {
                return callback(err);
              }
              child[action](payload, callback);
            });
          break;
          default:
          break;
        }
      }
    break;
  }
}
