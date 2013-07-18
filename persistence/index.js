var resource = require('resource'),
    persistence = resource.define('persistence');

persistence.schema.description = "enables persistence for resources";

var init = function (callback) {
  //
  // map uuid library to persistence resource
  //
  persistence.uuid = require('node-uuid');
  return callback(null, true);
};
persistence.method('init', init);

var enable = function (r, options) {

  if(typeof options === "string") {
    options = {
      type: options
    };
  }

  //
  // get persistence resource from type
  //
  var persistenceName = options.type || 'fs',
      _persistence = resource.use(persistenceName);

  //
  // start and enable persistence
  //
  _persistence.start(function() {
    return _persistence.enable(r, options);
  });
};
//
// enable is not a resource method ( as we don't want to defer binding of CRUD methods while waiting for node-uuid dep )
//
persistence.method('enable', enable);

persistence.dependencies = {
  "node-uuid": "*"
};

exports.persistence = persistence;
