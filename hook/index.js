var resource = require('resource'),
    hook = resource.define('hook');

hook.schema.description = "for managing event hooks ( IF this THEN that )";

hook.property("if", {
  "type":"string",
  "description": "the if action"
});

hook.property("then", {
  "type":"string",
  "description": "the then action"
});

hook.method('start', start, {
  "description": "loads all hooks into memory"
});

function start (callback) {
  //
  // Get all the hooks known to the system
  //
  hook.all(function(err, hooks) {
    //
    // For every hook, determine the resource::method pairs for IF and THEN events
    //
    hooks.forEach(function(h) {
      var arr = h.if.split('::'),
      _resource = arr[0],
      _method = arr[1];
      //
      // Take the IF _resource and add an after method for _method
      //
      if(
        typeof resource.resources[_resource] === 'undefined' ||
        typeof resource.resources[_resource].after !== 'function'
      ) {
        //resource.logger.warn('could not find resource: ' + _resource);
      }
      else {
        resource.resources[_resource].after(_method, function(data) {
          //
          // Inside this resource.after method, run the THEN resource::method pair,
          // using the results from the IF resource::method pair as "data" argument
          //
          var arr = h.then.split('::'),
          _resource = arr[0],
          _method = arr[1];
          if(typeof resource.resources[_resource] === 'undefined') {
            throw new Error('could not find resource: ' + _resource);
          }
          if(typeof resource.resources[_resource].methods[_method] !== 'function') {
            throw new Error('could not find resource method: ' + _resource + '.' + _method);
          }
          resource.resources[_resource].methods[_method](data);
        })
      }
    });
    callback(null)
  });
}

exports.hook = hook;
