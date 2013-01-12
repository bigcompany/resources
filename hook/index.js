var resource = require('resource'),
    hook = resource.define('hook');

hook.schema.description = "for managing event hooks ( IF this THEN that )";

hook.persist('memory');

hook.property("if", {
  "type":"string",
  "description": "the if action",
  "required": true
});

hook.property("then", {
  "type":"string",
  "description": "the then action",
  "required": true
});

hook.property("with", {
  "type":"string",
  "description": "additional data supplied to `then`",
  "type": "object"
});


hook.method('start', start, {
  "description": "loads all hooks into memory"
});

hook.method('bind', bind);

function bind (h) {
  var _if = h.if.split('::'),
  _resource = _if[0],
  _method = _if[1];
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
    var _then = h.then.split('::'),
        _with = h.with,
        withStr = "";

    if(_with) {
      //
      // Remark: Don't show `with` data in log messages ( for now )
      //
      // withStr = ' with ' + JSON.stringify(_with, true, 2);
    }

    resource.logger.hook('if `' + (_if[0] + "::" + _if[1]).magenta + '` then `' + (_then[0] + "::" + _then[1]).magenta + '`');
    resource.resources[_resource].after(_method, function(data, next) {
      //
      // Inside this resource.after method, run the THEN resource::method pair,
      // using the results from the IF resource::method pair as "data" argument
      //
      var _resource = _then[0],
          _method = _then[1];
      if(typeof resource.resources[_resource] === 'undefined') {
        throw new Error('could not find resource: ' + _resource);
      }
      if(typeof resource.resources[_resource].methods[_method] !== 'function') {
        throw new Error('could not find resource method: ' + _resource + '.' + _method);
      }

      if (_with !== null && typeof _with == 'object') {
        Object.keys(_with).forEach(function(key){
          data[key] = _with[key];
        });
      }
      resource.resources[_resource].methods[_method](data);
      next(null, data);
    });
  }
};

function start (callback) {
  //
  // Get all the hooks known to the system
  //
  hook.all(function(err, hooks) {
    //
    // For every hook, determine the resource::method pairs for IF and THEN events
    //
    hooks.forEach(function(h) {
      hook.bind(h);
    });
    callback(null, true);
  });
}

exports.hook = hook;
