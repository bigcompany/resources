var resource = require('resource'),
    persistence = resource.define('persistence');

persistence.schema.description = "enables persistence for resources";

var enable = function (r, options) {

  if(typeof options === "string") {
    options = {
      type: options
    };
  }

  console.log(__dirname);

  //
  // map uuid library to persistence resource
  //
  persistence.uuid = require('node-uuid');

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
persistence.enable = enable;

persistence.dependencies = {
  "node-uuid": "*"
};

exports.persistence = persistence;
