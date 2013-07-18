var resource = require('resource'),
    persist = resource.define('persist');

persist.schema.description = "enables persist for resources";

var enable = function (r, options) {

  if(typeof options === "string") {
    options = {
      type: options
    };
  }

  console.log(__dirname);

  //
  // map uuid library to persist resource
  //
  persist.uuid = require('node-uuid');

  //
  // get persist resource from type
  //
  var persistName = options.type || 'fs',
      _persist = resource.use("persist::" + persistName);

  //
  // start and enable persistence
  //
  _persist.start(function() {
    return _persist.enable(r, options);
  });
};
persist.method('enable', enable);


persist.dependencies = {
  "node-uuid": "*"
};

exports.persist = persist;
